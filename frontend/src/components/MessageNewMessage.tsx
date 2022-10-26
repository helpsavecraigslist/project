import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { API } from 'aws-amplify'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useNavigate, useLocation } from 'react-router-dom'
import Typography from '@mui/material/Typography';


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
        <Box sx={{width: '100', backgroundColor: '#F3F0F7', justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 1 }}>
          <Typography gutterBottom variant='h4'>
            New Message
          </Typography>
          <Box sx={{ width: '100%', backgroundColor: '#F3F0F7', alignItems: 'center', display: 'flex', flexDirection: 'column', p:1 }} >
            <Box sx={{ width: '90%', backgroundColor: '#FFFFFF', p:1}} >
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
                
            </Box>
          <Button 
            variant="contained"
            sx = {{my:.5}}
            onClick={() =>
                navigate('/MessageDetail')}
            >Start Messaging
          </Button>
          </Box>
        </Box>
    </>
  )
}
