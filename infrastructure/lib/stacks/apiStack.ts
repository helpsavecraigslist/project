import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import {
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  LambdaRestApi,
} from 'aws-cdk-lib/aws-apigateway'
import {
  ProviderAttribute,
  UserPool,
  UserPoolClientIdentityProvider,
  UserPoolIdentityProviderGoogle,
} from 'aws-cdk-lib/aws-cognito'
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda'
import { Provider } from 'aws-cdk-lib/custom-resources'
import { Construct } from 'constructs'

interface APIStackProps extends StackProps {
  callbackUrl: string
}

export class APIStack extends Stack {
  constructor(scope: Construct, id: string, props: APIStackProps) {
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

    const domainPrefix = this.node.tryGetContext('userPoolDomainPrefix')
    // Add a domain for Google setup

    const userPoolDomain = pool.addDomain('userPoolDomain', {
      cognitoDomain: {
        domainPrefix: domainPrefix,
      },
    })

    new CfnOutput(this, 'userPoolDomainRoot', {
      value: userPoolDomain.domainName,
    })

    const userPoolIdentityProviderGoogle = new UserPoolIdentityProviderGoogle(
      this,
      'userPoolGoogleIDP',
      {
        userPool: pool,
        clientId: this.node.tryGetContext('googleClientId'),
        clientSecret: this.node.tryGetContext('googleClientSecret'),
        scopes: ['profile', 'email'],
        attributeMapping: {
          email: ProviderAttribute.GOOGLE_EMAIL,
          familyName: ProviderAttribute.GOOGLE_FAMILY_NAME,
          givenName: ProviderAttribute.GOOGLE_GIVEN_NAME,
          profilePicture: ProviderAttribute.GOOGLE_PICTURE,
        },
      }
    )

    const client = pool.addClient('userPoolClient', {
      supportedIdentityProviders: [
        UserPoolClientIdentityProvider.COGNITO,
        UserPoolClientIdentityProvider.GOOGLE,
      ],
      oAuth: {
        callbackUrls: ['http://localhost:3000', `https://${props.callbackUrl}`],
        logoutUrls: ['http://localhost:3000', `https://${props.callbackUrl}`],
      },
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
