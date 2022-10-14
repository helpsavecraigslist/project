import React from 'react'
import SignIn from './components/SignUp'
import Items from './components/Items'
import { Amplify } from 'aws-amplify'
import settings from './aws-settings.json'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createTheme, colors, ThemeProvider } from '@mui/material'

// This object controls the Material UI theme overrides.
// See here for how this object is structured:
// https://mui.com/material-ui/customization/default-theme/
// Color guide: https://mui.com/material-ui/customization/color/
// TODO: consider moving this to a separate file and importing.
const theme = createTheme({
  palette: {
    primary: {
      main: '#572F88',
    }
  }
})

const App = () => {
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

  // Routing
  return (
    <>
    <ThemeProvider theme={theme}>
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/items" element={<Items />} />
        </Routes>
      </div>
    </BrowserRouter>
    </ThemeProvider>
    </>
  )
}

export default App
