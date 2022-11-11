import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material/';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Auth, API } from 'aws-amplify';
import { useState } from 'react'

//adapted from https://mui.com/material-ui/react-grid/

export default function MessageSendBox(props: any) {
  const {chatID, subject, buttonText, placeholder} = props;
  const [content, setContent] = useState('')

  const postNewMessage = async () => {
    const apiName = 'default'
    const path = 'messages/'
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`,
      },
      body: {
        chat_id:chatID,
        subject:subject,
        content,
      },
    }

    // TODO - add better error handling for unsuccessful post
    try {
      return await API.post(apiName, path, myInit)
    } catch {
      console.error('Error posting item')
    }
  }

  const handleReply = async () => {
    await postNewMessage()
    window.location.reload()
  }

  return (
    
    <Box sx={{
      bgcolor:'#F3F0F7', 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      alignItems: 'center',
      p:1,
      }} 
    >
        <Box sx={{
          bgcolor:'#FFFF', 
          display: 'flex', 
          flexDirection: 'column', 
          width: '95%', 
          alignItems: 'center',
          p:1,
          }} 
        >
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={4}
            placeholder = {placeholder}
            fullWidth
            value={content}
            variant='outlined'
            onChange={(e) => setContent(e.target.value)}
            
          />
        </Box>
        <Button variant="contained" sx={{m:1}} onClick = {() => handleReply()}>{buttonText}</Button>

    </Box>
    
  );
}