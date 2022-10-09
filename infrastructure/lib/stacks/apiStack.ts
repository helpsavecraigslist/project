import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import {
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  LambdaRestApi,
} from 'aws-cdk-lib/aws-apigateway'
import {
  UserPool,
  UserPoolClientIdentityProvider,
} from 'aws-cdk-lib/aws-cognito'
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

export class APIStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Auth setup
    const pool = new UserPool(this, 'userPool', {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      passwordPolicy: {
        requireSymbols: false,
        requireUppercase: false,
      },
    })

    const client = pool.addClient('userPoolClient', {
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
    })

    new CfnOutput(this, 'userPoolID', {
      value: pool.userPoolId,
    })

    new CfnOutput(this, 'userPoolClientID', {
      value: client.userPoolClientId,
    })

    // API setup

    const itemsFunction = new Function(this, 'itemsFunction', {
      code: Code.fromAsset('../backend'),
      handler: 'items.lambda_handler',
      runtime: Runtime.PYTHON_3_9,
    })

    const messagesFunction = new Function(this, 'messagesFunction', {
      code: Code.fromAsset('../backend'),
      handler: 'messages.lambda_handler',
      runtime: Runtime.PYTHON_3_9,
    })

    const api = new LambdaRestApi(this, 'api', {
      handler: itemsFunction,
      proxy: false,
    })

    const items = api.root.addResource('items', {
      defaultIntegration: new LambdaIntegration(itemsFunction),
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowCredentials: true,
      },
    })

    const messages = api.root.addResource('messages', {
      defaultIntegration: new LambdaIntegration(messagesFunction),
    })

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      'userPoolAuthorizer',
      {
        cognitoUserPools: [pool],
      }
    )

    items.addMethod('GET')

    items.addMethod('POST', undefined, {
      authorizer,
    })

    items.addProxy()

    messages.addMethod('ANY')

    messages.addProxy()
  }
}
