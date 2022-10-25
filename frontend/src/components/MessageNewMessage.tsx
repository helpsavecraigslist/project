import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { API } from 'aws-amplify'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useNavigate, useLocation } from 'react-router-dom'
import Chip from '@mui/material/Chip'

export default function MessageNewMessage() {
    const navigate = useNavigate()
    const itemData = useLocation()

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
                
                id="standard"
                label="Recipient"
                defaultValue=  {itemData.state.userID} 
                fullWidth
                sx = {{my:.5}}
                // disabled, could add but this is greyed out and looks not so great
                InputProps={{
                  readOnly: true,
                }}
            />
            <TextField
                fullWidth
                id="outlined-helperText"
                label="Subject"
                sx = {{my:.5}}
                defaultValue={itemData.state.subject} 
                
            />
       
            <TextField
                id="outlined-multiline-static"
                
                multiline
                rows={4}
                sx = {{my:.5}}
                placeholder = "enter your message here"
                fullWidth
            />
            <Button 
            variant="contained"
            sx = {{my:.5}}
            onClick={() =>
                navigate('/MessageDetail')}
            >Start Conversation</Button>
        </Box>
      </div>
    </>
  )
}
