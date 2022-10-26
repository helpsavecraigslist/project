import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { API } from 'aws-amplify'
import MessageDetailHeader from './MessageDetailHeader'
import MessageSendBox from './MessageSendBox'
import MessageDetailPrevMessage from './MessageDetailPrevMessage'

const messageData = 
    {
        username: "shellp",
        recipient: "qwerewq",
        postedDate: "Mon Day, Year",
        subject: "Our subject",
        messages: [
            {
                userID: "qwerewq", 
                userAvatar: "string", 
                content: "Hey, I want to buy that thing you posted! Thanks", 
                postedDate: "Oct 21, 2022",
            },
            {
                userID: "shellp", 
                userAvatar: "string", 
                content: "Send money here. Thanks", 
                postedDate: "Oct 22, 2022",
            },
            {
                userID: "qwerewq", 
                userAvatar: "string", 
                content: "I sent the money when are you shipping?", 
                postedDate: "Oct 23, 2022",
            }



        ],

    }




export default function MessageDetail() {
  const fetchMessageDetail = async () => {
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
    fetchMessageDetail()
  }, [])
  return (
    <>
       <div style={{width:"100%",display: 'block', justifyContent: 'center', alignItems: 'center'}}>
        

        <Box sx={{ width: '100%', }} >
          <MessageDetailHeader
              userID = {messageData.username}
              recepient = {messageData.recipient}
              subject = {messageData.subject}
              postedDate = {messageData.postedDate}
             
          ></MessageDetailHeader>
        
        
            {/* 
                Map array internal to passed JSON (for now), iterate over replies
                DATA HERE
            */}
          
            {messageData.messages.map((message,index)=>(
                
                <MessageDetailPrevMessage 
                key = {index}
                userID = {message.userID}
                userAvatar = {message.userAvatar}
                message = {message.content}
                postedDate = {message.postedDate}
                
                ></MessageDetailPrevMessage>
                
                )
                )
            }
            <MessageSendBox
                
                buttonText = "Reply"
                placeholder = "Write your reply here"
            ></MessageSendBox>
        </Box>

      </div>
    </>
  )
}
