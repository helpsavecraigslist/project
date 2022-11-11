import { useEffect, useState } from 'react'
import MessageItem from './MessageItem'
import Box from '@mui/material/Box'
import { Auth, API } from 'aws-amplify'
// import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography';

const messageData = [
    {
        username: "Generic",
        userAvatar: "string",
        recipient: "another user",
        postedDate: "Mon Day, Year",
        numReplies: 1,
        dateLast: "Mon Day, Year",
        userLast: "username of last reply",
        unread: "True",
        subject: "Our subject",
        numParticipants: 2,

    },
    {
      username: "shellp",
      userAvatar: "string to source",
      recipient: "qwerewq",
      postedDate: "Jun 18, 1982",
      numReplies: 1,
      dateLast: "Oct 20, 2022",
      userLast: "qwerewq",
      unread: "False",
      subject: "MBP sales",
      numParticipants: 2,

  },
  {
    username: "anyone",
    userAvatar: "string to source",
    recipient: "shellp",
    postedDate: "May 18, 2022",
    numReplies: 1,
    dateLast: "Jul 20, 2022",
    userLast: "anyone",
    unread: "False",
    subject: "motorcycle",
    numParticipants: 2,

},
]

export default function MessageList() {
  const [dbResponse, setDbResponse] = useState<any[]>([])
  // const navigate = useNavigate()

  const fetchMessageList = async () => {
    const apiName = 'default'
    const path = 'messages/chats'
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`,
      },      
    }
    try {
      const response = await API.get(apiName, path, myInit)
      setDbResponse([...response.Items])
    } catch {
      console.error('Error fetching messages')
    }
  }
 
  useEffect(() => {
    fetchMessageList()
  }, [])

  return (
    <>
       <div style={{width:"100%",display: 'block', justifyContent: 'space-evenlycenter', alignItems: 'center'}}>
        <Box sx={{width: '100%', alignItems: 'center', justifyContent: 'space-around', display: 'flex', }}>
          
          <Typography gutterBottom variant='h4'>
            Messages
          </Typography>
        </Box>
        <Box sx={{ width: '100%' }} >
          
          {/* TODO: pull message data */}
          {dbResponse.map((chat, index)=>(
              
             <MessageItem
              key = {index}
              chatID = {chat.ChatID}
              userID = {chat.OtherUserID.slice(-6)}
              userAvatar = {'string'}
              // recepient = {obj.recipient}
              subject = {'subjectwhat'}
              // postedDate = {message.postedDate}
              // numReplies = {message.numReplies}
              // numParticipants = {message.numParticipants}
              // dateLast = {message.dateLast}
              // userLast = {message.userLast}
              // unread = {message.unread}
              ></MessageItem>
              
              )
            )
          }
        </Box>
      
      </div>
    </>
  )

  // return (
  //   <>
  //      <div style={{width:"100%",display: 'block', justifyContent: 'space-evenlycenter', alignItems: 'center'}}>
  //       <Box sx={{width: '100%', alignItems: 'center', justifyContent: 'space-around', display: 'flex', }}>
          
  //         <Typography gutterBottom variant='h4'>
  //           Messages
  //         </Typography>
  //       </Box>
  //       <Box sx={{ width: '100%' }} >
          
  //         {/* TODO: pull message data */}
  //         {messageData.map((message,index)=>(
              
  //            <MessageItem 
  //             key = {index}
  //             userID = {message.username}
  //             userAvatar = {message.userAvatar}
  //             recepient = {message.recipient}
  //             subject = {message.subject}
  //             postedDate = {message.postedDate}
  //             numReplies = {message.numReplies}
  //             numParticipants = {message.numParticipants}
  //             dateLast = {message.dateLast}
  //             userLast = {message.userLast}
  //             unread = {message.unread}
  //             ></MessageItem>
              
  //             )
  //           )
  //         }
  //       </Box>
      
  //     </div>
  //   </>
  // )

}
