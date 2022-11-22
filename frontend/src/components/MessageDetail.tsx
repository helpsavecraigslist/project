import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import { Auth, API } from 'aws-amplify'
import MessageDetailHeader from './MessageDetailHeader'
// import MessageSendBox from './MessageSendBox'
import MessageDetailPrevMessage from './MessageDetailPrevMessage'

export default function MessageDetail() {
  const location = useLocation()
  const [AllMessages, setAllMessages] = useState([])

  const fetchAllMessages = async () => {
    const apiName = 'default'
    const path = 'messages/chat'
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`,
      },
      queryStringParameters: {ChatID: location.state.chatid},
    }
    try {
      const response = await API.get(apiName, path, myInit)
      setAllMessages([...response.Items])
    } catch {
      console.error('Error fetching message detail')
    }
  }
 
  useEffect(() => {
    fetchAllMessages()
  }, [])

  return (
    <>
       <div style={{width:"100%",display: 'block', justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{ width: '100%', }} >
          <MessageDetailHeader></MessageDetailHeader>
          
            {AllMessages.map((message,index)=>(
                
                <MessageDetailPrevMessage 
                  key = {index}
                  chatID = {message.ChatID}
                  displayUserID = {(message.preferred_username)? message.preferred_username: message.FromUser.slice(-6)}
                  OtherUser = {location.state.otheruser}
                  userAvatar = {"string"}
                  message = {message.Content}
                  postedDate = {message.PostedDate.slice(0, 19)}
                  subject = {message.Subject}
                ></MessageDetailPrevMessage>
                  
                )
              )
            }
        </Box>
      </div>
    </>
  )  
}
