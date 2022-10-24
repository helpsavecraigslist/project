import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';


//adapted from https://mui.com/material-ui/react-grid/

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

{/* 

*/}


export default function MessageDetailPrevMessage(props: any) {
  const {userID, userAvatar, message, postedDate, } = props;
  return (
    
    <Paper
      square
      sx={{
        p: 2,
        margin: 'auto auto 5px auto',
        maxWidth: '95%',
        flexGrow: 1,
        backgroundColor: '#D8CDE2'
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
                {postedDate}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {message}
              </Typography>
            </Grid>
            
          </Grid>
          
        </Grid>
      </Grid>
    </Paper>
    
  );
}
