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

import { Box, Grid } from '@mui/material'

interface ProfileProps {
  user: CognitoIdToken
}

const Profile = (props: ProfileProps) => {
  console.log(props.user.payload)
  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Grid>
        <Card>
          <CardMedia
            component='img'
            height='100%'
            image={props.user.payload.picture}
            alt='profile photo'
            referrerPolicy='no-referrer'
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              {props.user.payload.given_name} {props.user.payload.family_name}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size='small'>View Posts</Button>
            <Button size='small'>Edit Profile Picture</Button>
          </CardActions>
        </Card>
      </Grid>
    </Box>
  )
}

export default Profile
