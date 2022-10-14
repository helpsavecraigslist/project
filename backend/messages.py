import json


def lambda_handler(event, context):
    print(event)
    print(context)
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'message': 'hello from messages'
        }),
        "isBase64Encoded": False
    }