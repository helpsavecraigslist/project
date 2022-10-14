import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { Link } from 'react-router-dom';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import IconButton from '@mui/material/IconButton';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SellRoundedIcon from '@mui/icons-material/SellRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded';

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    open: false,
  })

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setState({ ...state, open: open })
    }

  return (
    <div>
      <React.Fragment key="MenuButton">
      <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuRoundedIcon />
          </IconButton>
        <Drawer open={state['open']} onClose={toggleDrawer(false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              <ListItem key="Home" disablePadding>
                <ListItemButton component={Link} to="/" >
                  <HomeRoundedIcon sx={{ m: 1 }} ></HomeRoundedIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
              <ListItem key="Items" disablePadding>
                <ListItemButton component={Link} to="/items" >
                  <SellRoundedIcon sx={{ m: 1 }}></SellRoundedIcon>
                  <ListItemText primary="Items" />
                </ListItemButton>
              </ListItem>
              <ListItem key="Messages" disablePadding>
                <ListItemButton>
                  <ForumRoundedIcon sx={{ m: 1 }}></ForumRoundedIcon>
                  <ListItemText primary="Messages" />
                </ListItemButton>
              </ListItem>
              <ListItem key="Profile" disablePadding>
                <ListItemButton>
                  <PersonRoundedIcon sx={{ m: 1 }}></PersonRoundedIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
              {/* TODO: Conditionally display log in/log out */}
              <ListItem key="Login" disablePadding>
                <ListItemButton>
                  <SyncAltRoundedIcon sx={{ m: 1 }}></SyncAltRoundedIcon>
                  <ListItemText primary="Log In/Out" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  )
}
