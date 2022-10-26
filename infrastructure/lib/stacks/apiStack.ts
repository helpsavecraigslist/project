import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import {
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  LambdaRestApi,
  MockIntegration,
  PassthroughBehavior,
} from 'aws-cdk-lib/aws-apigateway'
import {
  ProviderAttribute,
  StringAttribute,
  UserPool,
  UserPoolClientIdentityProvider,
  UserPoolIdentityProviderGoogle,
} from 'aws-cdk-lib/aws-cognito'
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda'
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

    userPoolIdentityProviderGoogle.applyRemovalPolicy(RemovalPolicy.RETAIN)

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

    // Database Setup
    const itemsDatabase = new Table(this, 'itemsTable', {
      partitionKey: {
        name: 'UserID',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'PostedDate',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    })

    itemsDatabase.addGlobalSecondaryIndex({
      indexName: 'location-date-gsi',
      partitionKey: {
        name: 'Location',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'PostedDate',
        type: AttributeType.STRING,
      },
    })

    const chatsDatabase = new Table(this, 'chatsTable', {
      partitionKey: {
        name: 'ChatID',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'PostedDate',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const usersDatabase = new Table(this, 'usersTable', {
      partitionKey: {
        name: 'UserID',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'ChatID',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    })

    // API setup
    const itemsFunction = new Function(this, 'itemsFunction', {
      code: Code.fromAsset('../backend'),
      handler: 'items.lambda_handler',
      runtime: Runtime.PYTHON_3_9,
      environment: {
        ITEMS_TABLE: itemsDatabase.tableName,
      },
    })

    itemsDatabase.grantReadWriteData(itemsFunction)

    const messagesFunction = new Function(this, 'messagesFunction', {
      code: Code.fromAsset('../backend'),
      handler: 'messages.lambda_handler',
      runtime: Runtime.PYTHON_3_9,
      environment: {
        CHATS_TABLE: chatsDatabase.tableName,
        USERS_TABLE: usersDatabase.tableName,
      },
    })

    chatsDatabase.grantReadWriteData(messagesFunction)
    
    usersDatabase.grantReadWriteData(messagesFunction)

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

    messages.addMethod('POST', undefined, {
      authorizer,
    })

    messages.addProxy()
  }
}
