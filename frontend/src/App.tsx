import React, { useEffect, useState } from 'react'
import Profile from './components/Profile'
import Items from './components/Items'
import { Amplify, Auth } from 'aws-amplify'
import { CognitoIdToken } from 'amazon-cognito-identity-js'
import settings from './aws-settings.json'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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

// This object controls the Material UI theme overrides.
// See here for how this object is structured:
// https://mui.com/material-ui/customization/default-theme/
// Color guide: https://mui.com/material-ui/customization/color/
// TODO: consider moving this to a separate file and importing.
const theme = createTheme({
  palette: {
    primary: {
      main: '#572F88',
    },
    secondary: {
      main: '#d5cde1',
    },
  },
})

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
    const idToken = (await Auth.currentSession()).getIdToken()
    setUser(idToken)
  }
  useEffect(() => {
    getCurrentUser()
  }, [])

  console.log(user)
  // Routing
  return (
    <>
      <ThemeProvider theme={theme}>
        <Container>
          <BrowserRouter>
            <NavBar user={user} />
            <Toolbar />
            <Routes>
              <Route
                path='/profile'
                element={user && <Profile user={user} />}
              />
              <Route path='/items' element={<Items />} />
              <Route path='/items/item' element={<SingleItem />} />
              <Route path='/itemform' element={<ItemForm />} />
              <Route path="/messages" element={<MessageList />} />
              <Route path='/messageDetail' element={<MessageDetail/>} />
              <Route path='/newMessage' element={<MessageNewMessage/>} />
            </Routes>
          </BrowserRouter>
        </Container>
      </ThemeProvider>
    </>
  )
}

export default App
