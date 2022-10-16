import json
import boto3
import os


def lambda_handler(event, context):
    print("event")
    print(event)
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

    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table(os.environ['ITEMS_TABLE'])

    avaliable_locations = ["Corvallis", "San Diego", "Austin", "Online"]
    if event['path'] == '/items/locations':
      return build_success_response(avaliable_locations)

    if event['httpMethod'] == 'GET':
      items = table.scan()
      return build_success_response(items)
    
    if event['httpMethod'] == 'POST':
      body = event['body']
      print(body)
      return build_success_response(event['requestContext']['authorizer']['claims'])

