import json


def lambda_handler(event, context):
    print(event)
    print(context)
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': '*, Authorization',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'message': 'hello from items'
        }),
        "isBase64Encoded": False
    }
