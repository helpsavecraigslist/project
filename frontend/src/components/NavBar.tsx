import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuDrawer from './MenuDrawer'


// Adapted from source code in Material UI Component Documentation
// https://mui.com/material-ui/react-app-bar/
export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <MenuDrawer></MenuDrawer>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            help save craigslist
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}