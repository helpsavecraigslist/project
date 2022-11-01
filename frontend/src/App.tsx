import React, { useEffect, useState } from 'react'
import Profile from './components/Profile'
import Items from './components/Items'
import { Amplify, Auth } from 'aws-amplify'
import { CognitoIdToken } from 'amazon-cognito-identity-js'
import settings from './aws-settings.json'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import {
  createTheme,
  colors,
  ThemeProvider,
  Toolbar,
  Container,
} from '@mui/material'
import NavBar from './components/NavBar'
import ItemForm from './components/ItemForm'
import MessageList from './components/MessageList'
import MessageDetail from './components/MessageDetail'
import SingleItem from './components/SingleItem'
import MessageNewMessage from './components/MessageNewMessage'
import '@fontsource/inika' // https://fontsource.org/fonts/inika
import '@fontsource/roboto'
import {appTheme} from './themes/theme'

// User authorization config
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

const App = () => {
  const [user, setUser] = useState<null | CognitoIdToken>(null)

  const getCurrentUser = async () => {
    try {
      const idToken = (await Auth.currentSession()).getIdToken()
      setUser(idToken)
    } catch {
      setUser(null)
    }
  }
  useEffect(() => {
    getCurrentUser()
  }, [])

  console.log(user)
  // Routing
  return (
    <>
      <ThemeProvider theme={appTheme}>
        <Container>
          <BrowserRouter>
            <NavBar user={user} />
            <Toolbar />
            <Routes>
              <Route path='/' element={<Navigate to='/items' />} />
              <Route
                path='/profile'
                element={user && <Profile user={user} />}
              />
              <Route path='/items' element={<Items />} />
              <Route path='/items/item' element={<SingleItem user={user} />} />
              <Route path='/itemform' element={<ItemForm />} />
              <Route path='/messages' element={<MessageList />} />
              <Route path='/messageDetail' element={<MessageDetail />} />
              <Route path='/newMessage' element={<MessageNewMessage />} />
            </Routes>
          </BrowserRouter>
        </Container>
      </ThemeProvider>
    </>
  )
}

export default App
