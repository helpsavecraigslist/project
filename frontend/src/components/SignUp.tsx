import React, { useEffect, useState } from 'react'
import { Auth, Hub } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css'
import { CognitoIdToken } from 'amazon-cognito-identity-js'
import NavBar from './NavBar'
import Toolbar from '@mui/material/Toolbar'

const SignIn = () => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userIDToken, setUserIDToken] = useState<CognitoIdToken | null>(null)
  Hub.listen('auth', ({ payload: { event, data } }) => {
    switch (event) {
      case 'signIn':
        console.log('sign in', event, data)
        break
      case 'signOut':
        console.log('sign out')
        break
    }
  })

  const checkSignIn = async () => {
    try {
      const idToken = await (await Auth.currentSession()).getIdToken()
      setIsSignedIn(true)
      setUserIDToken(idToken)
    } catch {}
  }

  useEffect(() => {
    checkSignIn()
  }, [])

  console.log(userIDToken?.getJwtToken())

  return (
    <>
      <NavBar />
      {/* Empty toolbar to offset content so it's not covered by app bar */}
      <Toolbar />
      {isSignedIn ? (
        <>
          <button onClick={() => Auth.signOut()}>Sign out</button>
          <h1>
            Here is your token decode it <a href="http://jwt.io">here</a>
          </h1>
          <p>{userIDToken?.getJwtToken()}</p>
        </>
      ) : (
        <>
          <button onClick={() => Auth.federatedSignIn()}>Sign in</button>
        </>
      )}
    </>
  )
}

export default SignIn
