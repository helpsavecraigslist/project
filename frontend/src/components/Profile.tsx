import React, { useEffect, useState } from 'react'
import { Auth, API } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css'
import { CognitoIdToken } from 'amazon-cognito-identity-js'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { Box, Grid, TextField } from '@mui/material'

interface ProfileProps {
  user: CognitoIdToken
}

const Profile = (props: ProfileProps) => {
  console.log(props.user.payload)

  const [newUsername, setNewUsername] = useState('')

  const updateUsername = async () => {
    if (!newUsername) {
      alert('You must enter a username')
      return
    }
    const apiName = 'default'
    const path = 'profile'
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`,
      },
      body: {
        username: newUsername,
      },
    }

    try {
      await API.post(apiName, path, myInit)
      // Source: https://github.com/aws-amplify/amplify-js/issues/2560
      try {
        const cognitoUser = await Auth.currentAuthenticatedUser()
        const currentSession = cognitoUser.signInUserSession
        cognitoUser.refreshSession(
          currentSession.refreshToken,
          (err, session) => {
            console.log('Refreshed tokens', err, session)
            window.location.reload()
          }
        )
      } catch (e) {
        console.log('Unable to refresh Token', e)
      }
    } catch {
      console.error('Error updating username')
    }
  }

  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Grid>
        <Card>
          <CardMedia
            component='img'
            height='100%'
            image={
              props.user.payload.picture ||
              'https://lh3.googleusercontent.com/a/ALm5wu0sHze805Q-vC_5P0mdvZqLIEE_GMvsDkM07m7Saw=s96-c'
            }
            alt='profile photo'
            referrerPolicy='no-referrer'
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              {props.user.payload.preferred_username || 'No username set'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size='small' onClick={() => updateUsername()}>
              Edit Username
            </Button>
            <TextField
              required
              id='new-username'
              label='New Username'
              variant='outlined'
              sx={{ flexGrow: 1 }}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </CardActions>
        </Card>
      </Grid>
    </Box>
  )
}

export default Profile
