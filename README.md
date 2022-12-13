# Instructions for Testing

To homepage takes you to the all items page and you can view all items when not logged in. Click "login" in the top right corner of the screen to login. This will allow you to create an account with an email and password, or login with Google. Once logged in you can open the menu and go to the page to post an item. This form allows you to uplod an image (jpeg and under 3MB), once uploaded you can view it in the all items page.

On the all items page, you can click "view details" to see a single item view. On the single item view you will see a "delete" and "edit" button if the item belongs to the currently signed in user. Clicking delete will remove the item from the database as well as remove the image from the S3 bucket. Clicking "edit" will bring you to a form pre-populated with the data from the item that is being edited.

From the all-items page or single-item view, click "Message Seller" or the mail icon, and the link will take you to a new message screen. Compose a message, on the new message screen, to the seller and click "Start Messaging." Presented with the message detail screen, you can view all message traffic sent. From the menu or the message detail screen, selecting "Messages" will direct to the user's inbox. Click a message to view the entire conversation. The user can also click the mail icon in the upper right, on the navigation bar, to view their inbox.  

You can view our hosted website here [https://d198vhptcel5q3.cloudfront.net/](https://d198vhptcel5q3.cloudfront.net/)

Login with your Gmail account, create an account, or login with these credentials here.

Email: lipej@oregonstate.edu

Password: Testing123

# Application Architecture

![image](https://user-images.githubusercontent.com/16655939/207387123-e14306ce-4041-4e18-989c-40e25026b9da.png)

# Installation - First Time Setup

**Note: the source code is located [here](https://github.com/helpsavecraigslist/project)**

To deploy this first do the prerequisites in the CDK workshop [here](https://cdkworkshop.com/) to ensure you can deploy CDK stacks and have your environment setup correctly.

## First build and deploy the frontend

Create a file `aws-settings.json` in the `/frontend/src` directory and fill it with JSON below. This is a placeholder to let you build the frontend the first time and these values will be filled in later in the setup.

```json
{
  "region": "",
  "userPoolId": "",
  "userPoolWebClientId": "",
  "cognitoDomain": "",
  "cloudfrontDomain": "",
  "APIEndpoint": ""
}
```

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
3. Under New Project, enter a "Capstone". A unique project ID will also be created. This cannot be changed later.
4. For Location, choose BROWSE, and then select "No organization".
5. Choose CREATE.
6. In the Google API Console, in the left navigation pane, choose OAuth consent screen. If you are presented with a screen that requests that you "Choose how you want to configure and register your app" with choices Internal or External for User Type, choose **EXTERNAL**.
7. For Application name, enter a "Save Craigslist".
8. Choose your email for the User Support Email.
9. Skip the "App Domain" section.
10. For Authorized domains, enter "amazoncognito.com".
11. Enter your email for developer contact information.
12. Click "Save and Continue"
13. Click "Add or Remove Scopes"

- Select ".../auth/userinfo.email"
- Select ".../auth/userinfo.profile"
- Select "openid"
- Click Update (at bottom) when done selecting these options

13. Click "Save and Continue"
14. Click "Save and Continue" for test users
15. Go back to the Google dashboard
16. On the lefthand side select "Credentials"
17. Select "Create credentials"
18. Select "OAuth Client ID"
19. For application type select "web application"
20. For name enter "Save Craigslist"
21. For Authorized JavaScript origins, enter your Amazon Cognito domain "https://yourDomainPrefix.auth.region.amazoncognito.com"

- Replace yourDomainPrefix (this should match what you entered in cdk.context.json earlier) and region with the correct values. You do not need to create the domain in the AWS/Congnito console too.

21. For Authorized redirect URIs, enter "https://yourDomainPrefix.auth.region.amazoncognito.com/oauth2/idpresponse"

- Replace yourDomainPrefix and region with the correct values

22. Download client id and client secret json
23. Put client id and client secret into `cdk.context.json` file you created earlier.

- Note: This file contains secrets so don't share it. In a production app you would want to use something like [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) but each secret costts $0.40 a month to store so we won't do this.

## Deploy Backend and Auth

To deploy the backend go to `/infrastructure`. After that run `cdk deploy APIStack` to deploy. After this deployment there will be output in the terminal for a userPoolClientID, userPoolID, userPoolDomainRoot, and API endpoint. Fill in the file `aws-settings.json` in the `/frontend/src` directory. An example of this is below. Change the region to wherever you have deployed to.

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

## Build and Deploy Everything

Run `./build_and_deploy.sh`

Note: you may need to run `chmod +x build_and_deploy.sh` to make the file an executable. Also I'm not sure the compatability of this script with Windows.
