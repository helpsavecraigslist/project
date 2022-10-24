import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import { API } from 'aws-amplify'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

export default function MessageNewMessage({ data }: any) {
    const navigate = useNavigate()

  const fetchMessageNewMessage = async () => {
    const apiName = 'default'
    const path = 'messages'
    const myInit = {}
    try {
      const response = await API.get(apiName, path, myInit)
      console.log(response)
    } catch {
      console.error('Error fetching message detail')
    }
  }
 
  useEffect(() => {
    fetchMessageNewMessage()
  }, [])
  return (
    <>
    {/* 
               
    */}
       <div style={{width:"100%",display: 'block', justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{ width: '100%' }} >
            <TextField
                fullWidth
                id="outlined-helperText"
                label="Recipient"
                defaultValue="Default Value" //need to fill this from data object passed from previous screen
                variant="filled"
            />
            <TextField
                fullWidth
                id="outlined-helperText"
                label="Subject"
                defaultValue="Default Value" //need to fill this from data object passed from previous screen
                variant="filled"
            />
            <TextField
                id="outlined-multiline-static"
                label="Multiline"
                multiline
                rows={4}
                placeholder = "enter your message here"
                fullWidth
            />
            <Button 
            variant="contained"
            onClick={() =>
                navigate('/MessageDetail')}
            >Start Conversation</Button>
        </Box>
      </div>
    </>
  )
}
