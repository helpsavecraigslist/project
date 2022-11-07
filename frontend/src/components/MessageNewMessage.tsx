import { FormEvent, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { Auth, API } from 'aws-amplify'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useNavigate, useLocation } from 'react-router-dom'
import Typography from '@mui/material/Typography';


export default function MessageNewMessage() {
  const navigate = useNavigate()
  const itemData = useLocation()
  const [content, setContent] = useState('')
  const [redirect, setRedirect] = useState(false)

  const randoUser = itemData.state.userID.slice(7, 15) + '@randomizedemail.com'

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

  const postNewChat = async () => {
    const apiName = 'default'
    const path = 'messages/newchat'
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`,
      },
      body: {
        to_user: itemData.state.userID,
        subject:itemData.state.subject,
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const response = await postNewChat()
    // TODO
    // if (redirect) {
      // const itemUrl = generateItemUrl(
      //   response.Item['UserID'],
      //   response.Item['PostedDate']
      // )
      // navigate(itemUrl)
    // }
  }

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
                    defaultValue=  {randoUser} 
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
                    label='Content'
                    multiline
                    rows={4}
                    sx = {{my:.5}}
                    placeholder = "enter your message here"
                    fullWidth
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                
            </Box>
          <Button 
            variant="contained"
            sx = {{my:.5}}
            onClick={handleSubmit}
            >Start Messaging
          </Button>
          </Box>
        </Box>
    </>
  )
}
