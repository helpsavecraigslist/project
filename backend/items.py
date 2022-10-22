import json
import boto3
import os
from datetime import datetime
from decimal import Decimal

# Source: https://bobbyhadz.com/blog/python-typeerror-object-of-type-decimal-is-not-json-serializable#:~:text=The%20Python%20%22TypeError%3A%20Object%20of,string%20to%20preserve%20its%20precision.
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        # 👇️ if passed in object is instance of Decimal
        # convert it to a string
        if isinstance(obj, Decimal):
            return str(obj)
        # 👇️ otherwise use the default behavior
        return json.JSONEncoder.default(self, obj)

def lambda_handler(event, context):
    print(json.dumps(event))
    print(context)

    avaliable_locations = ["Corvallis", "San Diego", "Austin", "Online"]

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

    dynamodb = boto3.resource('dynamodb')

    tableName = os.environ['ITEMS_TABLE']

    table = dynamodb.Table(tableName)

    def post_item(userName, eventBody):
      numPrice = Decimal(eventBody['price'])
      roundedPrice = round(numPrice, 2)
      if roundedPrice < 0:
        raise Exception("Number cannot be negative")
      if eventBody['location'] not in avaliable_locations:
        raise Exception("Invalid Location")
      if not eventBody['description']:
        raise Exception("Description not provided")
      if not eventBody['tags']:
        raise Exception("Tags not provided")
      if not eventBody['title']:
        raise Exception("Title not provided")
      item = {
          'UserID': userName,
          'PostedDate': str(datetime.now()),
          'Location': eventBody['location'],
          'Price': roundedPrice,
          'Tags': eventBody['tags'].split(','),
          'Title': eventBody['title'],
          'Picture': "https://mui.com/static/images/cards/contemplative-reptile.jpg",
          'Description': eventBody['description']
        }
      table.put_item(
        Item=item
      )
      responseItem = table.get_item(
        Key={
          'UserID': item['UserID'],
          'PostedDate': item['PostedDate']
        }
      )
      return responseItem

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
      except Exception as e:
        print('error', e)
        return build_failure_response(str(e))