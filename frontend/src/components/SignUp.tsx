import React from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
import service from '../common/service'
import '@aws-amplify/ui-react/styles.css'

const SignIn = () => {
  service.init()
  return (
    <>
      <Authenticator loginMechanisms={['email']}>
        {({ signOut, user }) => (
          <main>
            <h1>Hello {user && user.attributes && user.attributes.email}</h1>
            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator>
      <button onClick={service.getItems}>click for items</button>
      <button onClick={service.getMessages}>click for messages</button>
    </>
  )
}

export default SignIn
