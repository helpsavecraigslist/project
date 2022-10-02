import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import {
  UserPool,
  UserPoolClientIdentityProvider,
} from 'aws-cdk-lib/aws-cognito'
import { Construct } from 'constructs'

export class APIStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const pool = new UserPool(this, 'userPool', {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
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
  }
}
