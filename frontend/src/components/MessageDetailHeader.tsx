import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';


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

export default function MessageDetailHeader(props: any) {
  const {userID, subject, recepient, postedDate} = props;
  return (
    
    <Paper
      square
      sx={{
        p: 2,
        // margin: 'auto auto 5px auto',
        maxWidth: '95%',
        flexGrow: 1,
        backgroundColor: '#D8CDE2' 
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column">
            <Grid item xs>
              <Typography gutterBottom variant="h5" component="div">
                {subject}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {userID}, {recepient}: Started on {postedDate}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <Link to='/messages'>Back to Conversations</Link> 
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
    
  );
}
