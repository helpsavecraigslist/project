import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MenuDrawer from './MenuDrawer'
import { CognitoIdToken } from 'amazon-cognito-identity-js'
import { Button } from '@mui/material'
import { Auth } from 'aws-amplify/'

interface NavBarProps {
  user: null | CognitoIdToken
}

// Adapted from source code in Material UI Component Documentation
// https://mui.com/material-ui/react-app-bar/
export default function NavBar(props: NavBarProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <MenuDrawer user={props.user}></MenuDrawer>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            help save craigslist
          </Typography>
          {props.user ? (
            <Button color="inherit" onClick={() => Auth.signOut()}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={() => Auth.federatedSignIn()}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
