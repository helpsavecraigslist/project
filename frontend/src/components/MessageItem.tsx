import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material'


//adapted from https://mui.com/material-ui/react-grid/

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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
    
    <Paper
      square
      sx={{
        p: 2,
        margin: 'auto auto 5px auto',
        maxWidth: '95%',
        flexGrow: 1,
        backgroundColor: bgColor(unread) // need function here to change color for read and unread
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={1.5} container alignItems="center" justifyContent="center" direction='column'>
          <Avatar 
            alt={userID}
            src={userAvatar}
            variant='square' 
            sx={{width:50, height:50, }}
          ></Avatar>

          <h4>{userID}</h4> 
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column">
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                {subject}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {userID}, {recepient} - {postedDate}
              </Typography>
            </Grid>
            
          </Grid>
          <Grid item xs container direction="column">
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Replies:  {numReplies}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Participants:  {numParticipants}
              </Typography>
            </Grid>
            
          </Grid>
          <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                {dateLast}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {userLast}
              </Typography>
            </Grid>
        </Grid>
      </Grid>
    </Paper>
    
  );
}
