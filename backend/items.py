import json
import boto3
import os
from datetime import datetime


def lambda_handler(event, context):
    print("event")
    print(json.dumps(event))
    print("context")
    print(context)

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

    dynamodb = boto3.resource('dynamodb')

    tableName = os.environ['ITEMS_TABLE']

    table = dynamodb.Table(tableName)

    def post_item(userName, eventBody):
      response = table.put_item(
        Item={
          'UserID': userName,
          'PostedDate': str(datetime.now()),
          'Location': eventBody['location'],
          'Price':  eventBody['price'],
          'Tags': eventBody['tags'].split(','),
          'Title': eventBody['title'],
          'Picture': "https://mui.com/static/images/cards/contemplative-reptile.jpg"
        }
      )
      print("posted into table")
      print(response)
      return response

    avaliable_locations = ["Corvallis", "San Diego", "Austin", "Online"]
    if event['path'] == '/items/locations':
      return build_success_response(avaliable_locations)

    if event['httpMethod'] == 'GET':
      items = table.scan()
      return build_success_response(items)
    
    if event['httpMethod'] == 'POST':
      body = json.loads(event['body'])
      userName = event['requestContext']['authorizer']['claims']['cognito:username']
      try:
        response = post_item(userName, body)
        return build_success_response(response)
      except:
        return build_failure_response("Error posting item")

