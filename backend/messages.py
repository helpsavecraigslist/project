import json
import boto3
import botocore
import os
from datetime import datetime
from decimal import Decimal


chats_table_name = os.environ['CHATS_TABLE']
dynamodb  = boto3.resource('dynamodb')
chats_table = dynamodb.Table(chats_table_name)

users_table_name = os.environ['USERS_TABLE']
dynamodb  = boto3.resource('dynamodb')
users_table = dynamodb.Table(users_table_name)

userpool_client = boto3.client('cognito-idp')
user_pool_id = os.environ['USER_POOL_ID']

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        # 👇️ if passed in object is instance of Decimal
        # convert it to a string
        if isinstance(obj, Decimal):
            return str(obj)
        # 👇️ otherwise use the default behavior
        return json.JSONEncoder.default(self, obj)
        
        
def lambda_handler(event, context):

    def build_success_response(data):
      return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': '*, Authorization',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data, cls=DecimalEncoder),
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
          'Subject':  eventBody['subject'],
          'Content': eventBody['content'],
          # 'Unread': True
        }
      )
      return response
      
    # increment unread count in users table  
    def increment_unread(user_id, chat_id):
      response = users_table.update_item(
        Key={
          'UserID': user_id,
          'ChatID': chat_id
        },
        UpdateExpression = "ADD Unread :inc",
        ExpressionAttributeValues={':inc': 1},
      )
      return response
      
    # generate chatid using string comparison and return aaa-bbb
    def generate_chatid(userid1, userid2):
      if userid1 < userid2:
        return userid1 + '-' + userid2
      return userid2 + '-' + userid1
      
    # get preferred_username from cognito user pool
    def get_preferred_username(googleID):
      response = userpool_client.admin_get_user(
        UserPoolId=user_pool_id,
        Username=googleID
      )
      for name in response['UserAttributes']:
        if name['Name'] == 'preferred_username':
          return name['Value']
      return None
      
    
    print(json.dumps(event))
    
    # POST
    if event['httpMethod'] == 'POST':
      body = json.loads(event['body'])
      from_user = event['requestContext']['authorizer']['claims']['cognito:username']
      to_user = body['to_user']
      
      
      # Start a chat, add 2 documents of userID: ChatID to users table
      if event['path'] == '/messages/newchat':
        chat_id = generate_chatid(from_user, to_user)
        if to_user == from_user:
          return build_failure_response('Cannot start a new chat with the same ID.')
        try:
          users_table.put_item(
            Item={'UserID': from_user, 'ChatID':chat_id, 'OtherUserID': to_user, 'Unread': 0},
            ConditionExpression='attribute_not_exists(UserID) AND attribute_not_exists(ChatID)',
          )
          
        except botocore.exceptions.ClientError as e:
          if e.response['Error']['Code'] != 'ConditionalCheckFailedException': # Ignore ConditionalCheckFailedException
              raise
        try:     
          users_table.put_item(
            Item={'UserID': to_user, 'ChatID':chat_id, 'OtherUserID': from_user, 'Unread': 0},
            ConditionExpression='attribute_not_exists(UserID) AND attribute_not_exists(ChatID)',
          )
        except botocore.exceptions.ClientError as e:
          if e.response['Error']['Code'] != 'ConditionalCheckFailedException': # Ignore ConditionalCheckFailedException
              raise
      
      # reply for an existing chat
      else:
        chat_id = body['chat_id']
        
      # create a message in chats table, increment unread count for recipient          
      try:
        response = create_one_message(chat_id, body, from_user)
        increment_unread(to_user, chat_id)
        # print(response)
        return build_success_response(response)
      except Exception as e:
        print('error', e)
        return build_failure_response(str(e))
        
    
    # READ
    if event['httpMethod'] == 'GET':
      
      # Get unread for navbar
      if event['path'] == '/messages/unread':
        user = event['requestContext']['authorizer']['claims']['cognito:username']
        response = users_table.query(
          ExpressionAttributeValues = {':partitionkey': user},
          KeyConditionExpression = 'UserID = :partitionkey'
        )
        if 'Items' in response:
          # print(response)
          total_unread = 0
          for chat in response['Items']:
            total_unread += chat['Unread']
        return build_success_response({'Unread':total_unread})
        
      # Get all chats that one user participated
      if event['path'] == '/messages/chats':
        user = event['requestContext']['authorizer']['claims']['cognito:username']
        response = users_table.query(
          ExpressionAttributeValues = {':partitionkey': user},
          KeyConditionExpression = 'UserID = :partitionkey'
        )  
        if 'Items' in response:
          # print(response)
          total_unread = 0
          for chat in response['Items']:
            total_unread += chat['Unread']
            other_user_preferred_username = get_preferred_username(chat['OtherUserID'])
            chat['preferred_username'] = other_user_preferred_username
            
          response['TotalUnread'] = total_unread
          return build_success_response(response)
    
      # Get all messages in one chat and returned results are sorted by the sort key posted time. Update Unread to 0 when user views all messages in this chat.
      elif event['path'] == '/messages/chat':
        
        user = event['requestContext']['authorizer']['claims']['cognito:username']
        chat_id = event['queryStringParameters']['ChatID']
        
        # Get all messages in one chat
        try:
          response = chats_table.query(
            ExpressionAttributeValues = {':partitionkey': chat_id},
            KeyConditionExpression = 'ChatID = :partitionkey'
          )
          if 'Items' in response:
            for message in response['Items']:
              from_user_preferred_username = get_preferred_username(message['FromUser'])
              message['preferred_username'] = from_user_preferred_username
        except Exception as e:
          print('error', e)
          return build_failure_response(str(e))
    
        # Update Unread to 0 when user views all messages in this chat.
        try:
          response2 = users_table.update_item(
            Key={
              'UserID': user,
              'ChatID': chat_id
            },
            UpdateExpression = "SET Unread = :val",
            ExpressionAttributeValues={':val': 0},
          )
          return build_success_response(response)
        except Exception as e:
          print('error', e)
          return build_failure_response(str(e))

      
    # PATCH  
    # DELETE