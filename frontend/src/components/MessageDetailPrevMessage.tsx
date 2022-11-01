import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Card, Box } from '@mui/material';

//adapted from https://mui.com/material-ui/react-grid/

{/* 

*/}


export default function MessageDetailPrevMessage(props: any) {
  const {userID, userAvatar, message, postedDate, } = props;
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
            alt={userID}
            src={userAvatar}
            variant='square' 
            sx={{width:50, height:50, }}
          ></Avatar>
          <Typography gutterBottom variant='body1'>
            
            {userID} 
            
          </Typography>
        </Box>
        <Box sx={{bgcolor:'#F3F0F7', width: '90%', p:1}} >
         
              <Typography gutterBottom variant="subtitle2" component="div">
                {postedDate}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {message}
              </Typography>
         
          
        </Box>
      
    </Card>
    
  );
}
