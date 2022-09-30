To deploy this first do the prerequisites in the CDK workshop [here](https://cdkworkshop.com/) to ensure you can deploy CDK stacks and have your environment setup correctly.

To build the frontend assets go into the `/frontend` folder and run `npm run build`

To deploy the frontend go to `/infrastructure` and run `cdk deploy` (you may need to run `cdk bootstrap` before deploying for the first time)
