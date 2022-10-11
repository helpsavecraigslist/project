To deploy this first do the prerequisites in the CDK workshop [here](https://cdkworkshop.com/) to ensure you can deploy CDK stacks and have your environment setup correctly.

# First Time Setup

## First build and deploy the frontend

To build the frontend assets go into the `/frontend` folder and run `yarn build`.

To deploy the frontend go to `/infrastructure`, if this is your first time deploying the project run `cdk bootstrap` then run `cdk deploy FrontendStack`.

If it is not your first time deploying just run `cdk deploy FrontendStack`.

After deploying the frontend there will be a link outputted in the terminal. Go here to view your website. It will not work yet until you add the settings file later in the instructions!

## Create a Cognito domain name

Create a file `cdk.context.json` in the `/infrastructure` directory and fill it with the information below.

Choose a unique domain prefix. I would recommend something like `jlipe135134`, it doesn't matter what it is just that it is not in use. If it is in use there will be an error when deploying the APIStack later and you will need to change it

```json
{
  "userPoolDomainPrefix": "Pick a unique domain prefix",
  "googleClientId": "Leave empty for now",
  "googleClientSecret": "Leave empty for now"
}
```

## Setup Google as a Federated IdP

Note: These instructions were adapted from [here](https://aws.amazon.com/premiumsupport/knowledge-center/cognito-google-social-identity-provider/)

1. Sign in to the Google API Console with your Google account. For more information, see [Manage APIs in the API console](https://support.google.com/googleapi/answer/7037264) on the Google Help website.
2. On the Dashboard (APIs & Services), choose CREATE.
3. Under New Project, enter a "Capstone".
4. For Location, choose BROWSE, and then select a location (USA).
5. Choose CREATE.
6. In the Google API Console, in the left navigation pane, choose OAuth consent screen.
7. For Application name, enter a "Save Craigslist".
8. Choose your OSU email.
9. For Authorized domains, enter "amazoncognito.com".
10. Enter your OSU email for developer contact information.
11. Click "Save and Continue"
12. Click "Add or Remove Scopes"

- Select ".../auth/userinfo.email"
- Select ".../auth/userinfo.profile"
- Select "openid"

13. Click "Save and Continue"
14. Click "Save and Continue" for test users
15. Go back to the Google dashboard
16. On the lefthand side select "Credentials"
17. Select "Create credentials"
18. For application type select "web application"
19. For name enter "Save Craigslist"
20. For Authorized JavaScript origins, enter your Amazon Cognito domain "https://yourDomainPrefix.auth.region.amazoncognito.com"

- Replace yourDomainPrefix and region with the correct values

21. For Authorized redirect URIs, enter "https://yourDomainPrefix.auth.region.amazoncognito.com/oauth2/idpresponse"

- Replace yourDomainPrefix and region with the correct values

22. Download client id and client secret json
23. Put client id and client secret into `cdk.context.json` file you created earlier.

- Note: This file contains secrets so don't share it. In a production app you would want to use something like [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) but each secret costts $0.40 a month to store so we won't do this.

## Deploy Backend and Auth

To deploy the backend go to `/infrastructure`. After that run `cdk deploy APIStack` to deploy. After this deployment there will be output in the terminal for a userPoolClientID, userPoolID, userPoolDomainRoot, and API endpoint. Create a file `aws-settings.json` in the `/frontend/src` directory. An example of this is below. Change the region to wherever you have deployed to.

```json
{
  "region": "Put your deployment region",
  "userPoolId": "Put your user pool id",
  "userPoolWebClientId": "Put your UserPoolClientId",
  "cognitoDomain": "Put your cognito domain example (jlipe.auth.us-east-1.amazoncognito.com)",
  "cloudfrontDomain": "Put your cloudfront domain for the frontend",
  "APIEndpoint": "Put apiEndpoint"
}
```

## Rebuild and Redeploy the Frontend

Rebuild the frontend assets. Go into the `/frontend` folder and run `yarn build`

Deploy the frontend. Go to `/infrastructure` and run `cdk deploy FrontendStack`.

Now your frontend should be working with Auth and connected to API Gateway.

# Normal Development

## Developing and Deploying the Frontend

To develop the frontend in the `/frontend` folder run `yarn start` to start a local development environment.

To build and deploy run `yarn build` in the `/frontend` directory. Then go to `/infrastructure` and run `cdk deploy FrontendStack`
