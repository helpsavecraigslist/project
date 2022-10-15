import React, { useEffect, useState } from 'react'
import { Auth, Hub } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css'
import { CognitoIdToken } from 'amazon-cognito-identity-js'

interface ProfileProps {
  user: CognitoIdToken
}

const Profile = (props: ProfileProps) => {
  return (
    <>
      <h1>
        Here is your token decode it <a href="http://jwt.io">here</a>
      </h1>
      <p>{props.user.getJwtToken()}</p>
    </>
  )
}

export default Profile
