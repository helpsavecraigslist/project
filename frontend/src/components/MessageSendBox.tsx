import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';


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

export default function MessageSendBox(props: any) {
  const {buttonText, placeholder} = props;
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
        <TextField
          id="outlined-multiline-static"
          label="Multiline"
          multiline
          rows={4}
          placeholder = {placeholder}
          fullWidth
        />
        <Button variant="contained">{buttonText}</Button>
    </Paper>
    
  );
}

