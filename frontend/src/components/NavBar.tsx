// import * as React from 'react'
import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
// import * as ReactDOM from 'react-dom';
// var ReactDOM = require('react-dom');


import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MenuDrawer from './MenuDrawer'
import { CognitoIdToken } from 'amazon-cognito-identity-js'
import { Button } from '@mui/material'
import { Auth, API } from 'aws-amplify/'
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { Link } from 'react-router-dom'
interface NavBarProps {
  user: null | CognitoIdToken;
  unread: number;
}

{/* 
  Future async GetUnread() will update badgeContent prop below with number of unread messages for user 
*/}
// function GetUnread(){return '45'};

// Adapted from source code in Material UI Component Documentation
// https://mui.com/material-ui/react-app-bar/
export default function NavBar(props: NavBarProps) {
  // const [Unread, setUnread] = useState(0)

  // const fetchUnread = async () => {
  //   // setUnread(45)
  //   const apiName = 'default'
  //   const path = 'messages/unread'
  //   const myInit = {
  //     headers: {
  //       Authorization: `Bearer ${(await Auth.currentSession())
  //         .getIdToken()
  //         .getJwtToken()}`,
  //     },
  //   }
  //   try {
  //     const response = await API.get(apiName, path, myInit)
  //     setUnread(response.Unread)
  //   } catch {
  //     console.error('Error fetching message detail')
  //   }
  // }
 
  // useEffect(() => {
  //   fetchUnread()
  // }, [])


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <MenuDrawer user={props.user}></MenuDrawer>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            help save craigslist
          </Typography>
          {props.user && (
            <Badge badgeContent={props.unread} color="primary" showZero component={Link} to='/messages'> 
              <MailIcon color="secondary" />
            </Badge>
          )}
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
