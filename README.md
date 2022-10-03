To deploy this first do the prerequisites in the CDK workshop [here](https://cdkworkshop.com/) to ensure you can deploy CDK stacks and have your environment setup correctly.

To build the frontend assets go into the `/frontend` folder and run `yarn build`

To deploy to AWS go to `/infrastructure`. If this is your first time deploying the project run `cdk bootstrap`. After that run `cdk deploy APIStack` to deploy the Cognito User pool. After this deployment there will be an output in the terminal for a userPoolClientID and userPoolID. Create a file `aws-settings.json` in the `/frontend/src` directory. An example of this is below. Change the region to wherever you have deployed to.

```json
{
  "Auth": {
    "region": "PUT YOUR DEPLOYMENT REGION HERE",
    "userPoolId": "PUT USER POOL ID HERE",
    "userPoolWebClientId": "PUT USER POOL WEB CLIENT ID HERE"
  }
}
```

To deploy the frontend go to `/infrastructure` and run `cdk deploy FrontendStack`.

After deploying the frontend there will be a link outputted in the terminal. Go here to view your website.

# Developing and Deploying the Frontend

To develop the frontend in the `/frontend` folder run `yarn start` to start a local development environment. To publish this follow the same steps for building and deploying that you did the first time.

Note: When you deploy this the CloudFormation cache can take up to 24 hours to propogate to the 400+ locations the content is being served from. If you want to see your changes deployed immediately go to CloudFront in the AWS management console, select your distribution, select "invalidations", select "create invalidation", enter "/\*" and click "create invalidation". This will invalidate all the old files and CloudFront will get the newest content from the S3 bucket immediately.
