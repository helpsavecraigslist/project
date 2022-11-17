import json
import boto3
import os
from datetime import datetime

chats_table_name = os.environ['CHATS_TABLE']
dynamodb  = boto3.resource('dynamodb')
chats_table = dynamodb.Table(chats_table_name)

users_table_name = os.environ['USERS_TABLE']
dynamodb  = boto3.resource('dynamodb')
users_table = dynamodb.Table(users_table_name)

def lambda_handler(event, context):

    def build_success_response(data):
      return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': '*, Authorization',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data),
        "isBase64Encoded": False
    }

    def build_failure_response(message):
      return {
        'statusCode': 400,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': '*, Authorization',
            'Access-Control-Allow-Origin': '*'
        },
        'body': message,
        "isBase64Encoded": False
    }
        
    def create_one_message(chat_id, eventBody, from_user):
      response = chats_table.put_item(
        Item={
          'ChatID': chat_id,
          'PostedDate': str(datetime.now()),
          'FromUser': from_user,
          # 'ToUser': eventBody['to_user'],
          'Subject':  eventBody['subject'],
          'Content': eventBody['content'],
          'Unread': True
        }
      )
      return response

    # generate chatid using string comparison and return aaa-bbb
    def generate_chatid(userid1, userid2):
      if userid1 < userid2:
        return userid1 + '-' + userid2
      return userid2 + '-' + userid1
    
    
    print(json.dumps(event))
    
    # POST
    if event['httpMethod'] == 'POST':
      body = json.loads(event['body'])
      from_user = event['requestContext']['authorizer']['claims']['cognito:username']


      # Start a chat, add 2 documents of userID: ChatID to users table
      if event['path'] == '/messages/newchat':
        to_user = body['to_user']
        chat_id = generate_chatid(from_user, to_user)
        if to_user == from_user:
          return build_failure_response('Cannot start a new chat with the same ID.')
        try:
          with users_table.batch_writer() as batch:
            batch.put_item(Item={'UserID': from_user, 'ChatID':chat_id, 'OtherUserID': to_user})
            batch.put_item(Item={'UserID': to_user, 'ChatID':chat_id, 'OtherUserID': from_user})
        except Exception as e:
          print('error', e)
          return build_failure_response(str(e))
      
      else:
        chat_id = body['chat_id']
        
      # create a message in chats table          
      try:
        response = create_one_message(chat_id, body, from_user)
        print(response)
        return build_success_response(response)
      except Exception as e:
        print('error', e)
        return build_failure_response(str(e))
        
    
    # # READ
    if event['httpMethod'] == 'GET':
      
      # Get all chats that one user participated
      if event['path'] == '/messages/chats':
        user = event['requestContext']['authorizer']['claims']['cognito:username']
        response = users_table.query(
          ExpressionAttributeValues = {':partitionkey': user},
          KeyConditionExpression = 'UserID = :partitionkey'
        )  
        if 'Items' in response:
          print(response)
          return build_success_response(response)
    
      # Get all messages in one particular chat. Query results are sorted by the sort key.
      elif event['path'] == '/messages/chat':
        chat_id = event['queryStringParameters']['ChatID']
        response = chats_table.query(
          ExpressionAttributeValues = {':partitionkey': chat_id},
          KeyConditionExpression = 'ChatID = :partitionkey'
        )
        if 'Items' in response:
          print(response)
          return build_success_response(response)
    
    # Gets all the user's unread messages. Returns all message data for processing on frontend
      # TODO: test, unable to test without message funtionality 
      elif event['path'] == '/messages/unread':
        user = event['requestContext']['authorizer']['claims']['cognito:username']
        response = chats_table.query(
          KeyConditionExpression = Key('ToUser').eq(user) & Key('Unread').eq(True)
        )
        if 'Items' in response:
          print(response)
          return build_success_response(response)
    
    # PATCH

    # DELETE