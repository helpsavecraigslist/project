import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Card, Box } from '@mui/material';
import MessageSendBox from './MessageSendBox'

//adapted from https://mui.com/material-ui/react-grid/


export default function MessageDetailPrevMessage(props: any) {
  const {chatID, displayUserID, OtherUser, userAvatar, message, postedDate, subject} = props;
  return (
    
    <Card
      square
      sx={{
        my: 1,
        maxWidth: '100%',
        flexGrow: 1,
        backgroundColor: '#D8CDE2',
        display:'flex',
        alignItems:'row'
      }}
    >
      
        <Box sx={{
          bgcolor:'#D8CDE2', 
          display: 'flex', 
          flexDirection: 'column', 
          width: '25%', 
          alignItems: 'center',
          justifyContent: 'center',
          p:1,
          }} 
        >
          <Avatar 
            alt={displayUserID}
            src={userAvatar}
            variant='square' 
            sx={{width:50, height:50, }}
          ></Avatar>
          <Typography gutterBottom variant='body2'>
            
            {displayUserID} 
            
          </Typography>
        </Box>
        
        <Box sx={{bgcolor:'#F3F0F7', width: '80%', p:1}} >
        <Box sx={{bgcolor:'#F3F0F7', width: '100%', p:1}} >
          <Typography gutterBottom variant="subtitle2" component="div">
            {subject}
          </Typography>         
          <Typography gutterBottom variant="subtitle2" component="div">
            {postedDate}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {message}
          </Typography>
        </Box>

        <Box sx={{bgcolor:'#F3F0F7', width: '100%', p:1}}>

          <MessageSendBox
            chatID = {chatID}
            toUser = {OtherUser}
            subject = {subject}
            buttonText = "Reply"
            placeholder = "Write your reply here"
          ></MessageSendBox>

        </Box>
        </Box>
    </Card>
    
  );
}
