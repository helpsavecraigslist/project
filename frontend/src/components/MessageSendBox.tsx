import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material/';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';


//adapted from https://mui.com/material-ui/react-grid/



{/* 
 
*/}

export default function MessageSendBox(props: any) {
  const {buttonText, placeholder} = props;
  return (
    
    <Box sx={{
      bgcolor:'#F3F0F7', 
      display: 'flex', 
      flexDirection: 'column', 
      width: '95%', 
      alignItems: 'center',
      p:1,
      }} 
    >
        <Box sx={{
          bgcolor:'#FFFF', 
          display: 'flex', 
          flexDirection: 'column', 
          width: '95%', 
          alignItems: 'center',
          p:1,
          }} 
        >
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={4}
            placeholder = {placeholder}
            fullWidth
            variant='outlined'
            
          />
        </Box>
        <Button variant="contained" sx={{m:1}}>{buttonText}</Button>
      
    </Box>
    
  );
}

