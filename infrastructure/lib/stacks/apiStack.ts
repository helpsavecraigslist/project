import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import {
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  LambdaRestApi,
  AuthorizationType,
} from 'aws-cdk-lib/aws-apigateway'
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import {
  ProviderAttribute,
  UserPool,
  UserPoolClientIdentityProvider,
  UserPoolIdentityProviderGoogle,
} from 'aws-cdk-lib/aws-cognito'
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda'
import { Bucket } from 'aws-cdk-lib/aws-s3'
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

    // Static images bucket and distribution
    const imagesBucket = new Bucket(this, 'imagesBucket', {})

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      'ImagesOriginAccessIdentity'
    )
    imagesBucket.grantRead(originAccessIdentity)

    const imagesDistribution = new Distribution(this, 'imagesDistribution', {
      defaultBehavior: {
        origin: new S3Origin(imagesBucket, { originAccessIdentity }),
      },
    })

    // API setup
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
        IMAGES_BUCKET: imagesBucket.bucketName,
        DISTRIBUTION_URL: imagesDistribution.distributionDomainName,
      },
    })

    imagesBucket.grantReadWrite(itemsFunction)

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

    const profileFunction = new Function(this, 'profileFunction', {
      code: Code.fromAsset('../backend'),
      handler: 'profile.lambda_handler',
      runtime: Runtime.PYTHON_3_9,
      environment: {
        USER_POOL_ID: pool.userPoolId,
      },
    })

    profileFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['cognito-idp:*'],
        resources: [
          `arn:aws:cognito-idp:${pool.stack.region}:${pool.stack.account}:userpool/${pool.userPoolId}`,
        ],
      })
    )

    chatsDatabase.grantReadWriteData(messagesFunction)

    usersDatabase.grantReadWriteData(messagesFunction)

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      'userPoolAuthorizer',
      {
        cognitoUserPools: [pool],
      }
    )

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

    const profile = api.root.addResource('profile', {
      defaultIntegration: new LambdaIntegration(profileFunction),
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowCredentials: true,
      },
    })

    const messages = api.root.addResource('messages', {
      defaultIntegration: new LambdaIntegration(messagesFunction),
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowCredentials: true,
      },
      // defaultMethodOptions: {
      //   authorizationType: AuthorizationType.COGNITO,
      //   authorizer: authorizer,
      // },
    })

    items.addMethod('GET')

    items.addMethod('POST', undefined, {
      authorizer,
    })

    items.addMethod('DELETE', undefined, {
      authorizer,
    })

    items.addMethod('PUT', undefined, {
      authorizer,
    })

    items.addProxy()

    profile.addMethod('GET')

    profile.addMethod('POST', undefined, {
      authorizer,
    })

    messages.addMethod('ANY')

    messages.addMethod('POST', undefined, {
      authorizer,
    })

    const messages_proxy = messages.addProxy({
      anyMethod: true,
      // defaultMethodOptions: {authorizer},
    })
    messages_proxy.addMethod('POST', undefined, { authorizer })
    messages_proxy.addMethod('GET', undefined, { authorizer })
  }
}
