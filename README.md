To deploy this first do the prerequisites in the CDK workshop [here](https://cdkworkshop.com/) to ensure you can deploy CDK stacks and have your environment setup correctly.

To build the frontend assets go into the `/frontend` folder and run `npm run build`

To deploy the frontend go to `/infrastructure` and run `cdk deploy --all` (you may need to run `cdk bootstrap` before deploying for the first time)

When the API stack deploys it will output the userPoolClientID and userPoolID, you will need these to connect the frontend to the user pool

Create a file `aws-settings.json` in the root folder of the `/frontend/src` directory. An example of this is below. Change the region to wherever you have deployed to.

```json
{
  "Auth": {
    "region": "PUT YOUR DEPLOYMENT REGION HERE",
    "userPoolId": "PUT USER POOL ID HERE",
    "userPoolWebClientId": "PUT USER POOL WEB CLIENT ID HERE"
  }
}
```
