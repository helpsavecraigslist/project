import React from 'react'
import SignIn from './components/SignUp'
import { Amplify } from 'aws-amplify'
import settings from './aws-settings.json'

const App = () => {
  Amplify.configure({
    Auth: {
      region: settings.region,
      userPoolId: settings.userPoolId,
      userPoolWebClientId: settings.userPoolWebClientId,
      oauth: {
        domain: settings.cognitoDomain,
        scope: ['email', 'profile', 'openid'],
        redirectSignIn:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : `https://${settings.cloudfrontDomain}`,
        redirectSignOut:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : `https://${settings.cloudfrontDomain}`,
        responseType: 'code',
      },
    },
    API: {
      endpoints: [
        {
          name: 'default',
          endpoint: settings.APIEndpoint,
        },
      ],
    },
  })
  return <SignIn />
}

export default App
