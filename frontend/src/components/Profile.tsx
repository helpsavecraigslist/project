import React, { useEffect, useState } from 'react'
import { Auth, API } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css'
import { CognitoIdToken } from 'amazon-cognito-identity-js'

interface ProfileProps {
  user: CognitoIdToken
}

const Profile = (props: ProfileProps) => {
  const postData = async () => {
    const apiName = 'default'
    const path = 'items'
    const myInit = {
      headers: {
        Authorization: `Bearer ${props.user.getJwtToken()}`,
      },
      body: {
        hello: 'there',
      },
    }

    return await API.post(apiName, path, myInit)
  }

  const getData = async () => {
    const apiName = 'default'
    const path = 'items'
    const myInit = {}

    return await API.get(apiName, path, myInit)
  }

  const getLocations = async () => {
    const apiName = 'default'
    const path = 'items/locations'
    const myInit = {}

    return await API.get(apiName, path, myInit)
  }

  return (
    <>
      <h1>
        Here is your token decode it <a href="http://jwt.io">here</a>
      </h1>
      <p>{props.user.getJwtToken()}</p>
      <button onClick={() => postData()}>Post something</button>
      <button onClick={() => getLocations()}>Get Locations</button>
      <button onClick={() => getData()}>Get all items</button>
    </>
  )
}

export default Profile
