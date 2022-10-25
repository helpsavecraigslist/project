import json
import boto3
from datetime import datetime

chats_table_name = 'chats'
dynamodb  = boto3.resource('dynamodb')
chats_table = dynamodb.Table(chats_table_name)

users_table_name = 'users'
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

    def create_two_userchat(user1, user2, chat_id):
      response1 = users_table.put_item(Item={'UserID': user1, 'ChatID':chat_id})  # can include ConditionExpression='attribute_not_exists(?)'
      response2 = users_table.put_item(Item={'UserID': user2, 'ChatID':chat_id})
      return (response1, response2)
      
    
    def create_one_message(chat_id, eventBody):
      response = chats_table.put_item(
        Item={
          'ChatID': chat_id,
          'PostedDate': str(datetime.now()),
          'FromUser': eventBody['from_user'],
          'ToUser': eventBody['to_user'],
          'Subject':  eventBody['subject'],
          'Content': eventBody['content'],
          'Unread': True
        }
      )
      return response

    # generate chatid using string comparison and return aaa#bbb
    def generate_chatid(userid1, userid2):
      if userid1 < userid2:
        return userid1 + '-' + userid2
      return userid2 + '-' + userid1
    
    
    if not event:
      return
    
    print(json.dumps(event))
    
    # POST
    if event['httpMethod'] == 'POST':
      body = json.loads(event['body'])
      to_user = body['to_user']
      from_user = body['from_user']
      # from_user = event['requestContext']['authorizer']['claims']['cognito:username']
      chat_id = generate_chatid(from_user, to_user)
      try:
        create_two_userchat(from_user, to_user, chat_id)  # add 2 documents of userID: ChatID to users table
        response = create_one_message(chat_id, body)
        print(response)
        return build_success_response(response)
      except Exception as e:
        print('error', e)
        return build_failure_response(str(e))
        
    
    # READ
    if event['httpMethod'] == 'GET':
      
      # Get all chats that one user participated
      if event['path'] == '/chats':
        user = event['requestContext']['authorizer']['claims']['cognito:username']
        response = users_table.query(
          ExpressionAttributeValues = {':partitionkey': user},
          KeyConditionExpression = 'UserID = :partitionkey'
        )  
        if 'Items' in response:
          print(response)
          return build_success_response(response)
    
      # Get all messages in one particular chat. Query results are sorted by the sort key.
      elif event['path'] == '/chat':
        chat_id = event['queryStringParameters']['chatid']
        response = chats_table.query(
          ExpressionAttributeValues = {':partitionkey': chat_id},
          KeyConditionExpression = 'ChatID = :partitionkey'
        )
        if 'Items' in response:
          print(response)
          return build_success_response(response)
    
    
    # PATCH
    
    # DELETE