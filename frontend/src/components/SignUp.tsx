import React from 'react'
import { Amplify } from 'aws-amplify'
import settings from '../aws-settings.json'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

Amplify.configure(settings)

const SignIn = () => {
  return (
    <Authenticator loginMechanisms={['email']}>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user && user.attributes && user.attributes.email}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  )
}

export default SignIn
