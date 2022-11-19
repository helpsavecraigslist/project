
import json
import boto3
import os

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

    print(json.dumps(event))

    client = boto3.client('cognito-idp')
    user_pool_id = os.environ['USER_POOL_ID']

    # The post method updates a preferred_username
    if event['httpMethod'] == 'POST':
      body = json.loads(event['body'])
      preferred_username = body['username']
      current_user = event['requestContext']['authorizer']['claims']['cognito:username']

      try:
        response = client.admin_update_user_attributes(
          UserPoolId=user_pool_id,
          Username=current_user,
          UserAttributes=[
              {
                  'Name': 'preferred_username',
                  'Value': preferred_username
              },
          ]
        )

        print(response)
        return build_success_response(response)
      except:
        build_failure_response('error updating username')

    # The get method gives the preferred_username given the cognito:username
    if event['httpMethod'] == 'GET':
      username = event['queryStringParameters']['user']
      response = client.admin_get_user(
        UserPoolId=user_pool_id,
        Username=username
      )
      
      for attribute in response['UserAttributes']:
        if attribute['Name'] == 'preferred_username':
          return build_success_response(attribute['Value'])
      
      return build_success_response(None)
