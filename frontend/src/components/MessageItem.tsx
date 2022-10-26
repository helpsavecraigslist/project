import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { Card, Box } from '@mui/material';

{/* 
  bgColor
  Input: 'True' or anything else 
  Output: #D8CDE2 or #F3F0F8 hexdec color for unread/read messages
  Notes: consider changing output to theme.dark/ .light 
*/}
function bgColor(unread) {if (unread == 'True'){return '#D8CDE2';}return '#F3F0F8'};

export default function MessageItem(props: any) {
  const {userID, userAvatar, subject, recepient, postedDate, numParticipants, numReplies, dateLast, userLast, unread} = props;
  return (
    
    <Card
      square
      
      sx={{
        my: 1,
        display:'flex',
        alignItems:'row',
        maxWidth: '95%',
        flexGrow: 1,
        backgroundColor: bgColor(unread) // need function here to change color for read and unread
      }}
    >  
      <Box sx={{
          display: 'flex', 
          flexDirection: 'column', 
          width: '10%', 
          alignItems: 'center',
          p:1,
          }} 
        >
          <Avatar 
            alt={userID}
            src={userAvatar}
            variant='square' 
            sx={{width:50, height:50, }}
          ></Avatar>
          <Typography gutterBottom variant='body1'>
            {userID} 
          </Typography>
        </Box>
        <Box sx={{
          display: 'inline-flex', 
          flexDirection: 'row', width:'90%', 
          alignItems: 'center',
          justifyContent: 'space-evenly'  
          }}
          >
          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Typography gutterBottom variant="body1" component="div">
                <Link to='/messageDetail'> {subject} </Link>
              </Typography>
              <Typography variant="body2" gutterBottom>
                {userID}, {recepient} - {postedDate}
              </Typography> 
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Typography gutterBottom variant="body2" component="div">
                Replies:  {numReplies}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Participants:  {numParticipants}
              </Typography>
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Typography gutterBottom variant="body2" component="div">
                {dateLast}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {userLast}
              </Typography>
          </Box>
        </Box>
    </Card>
  );
}
