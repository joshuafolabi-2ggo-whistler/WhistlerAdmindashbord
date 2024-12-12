import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/GridView';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/material/styles';
import whistlerLogo from './logo-dark.png'

const Logo = styled('img')({
    width: '150px',
    marginBottom: '50px',
  });
const drawerWidth = 240;
const Header = ({onLogout}) => {
    const [open, setOpen] = useState(true);

    const handleDrawerToggle = () => {
      setOpen(!open);
    };

    const handleLogout = () =>{
        onLogout(false)
        localStorage.removeItem('isAuthenticated');
    }
  
  return (
   <>
          
          <AppBar
        position="fixed"
        sx={{
          width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
          ml: open ? `${drawerWidth}px` : 0,
          boxShadow: 'none',
          backgroundColor: '#ffffff', 
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-start' }}>

            <IconButton
              color="success"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ marginRight: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ color: '#333', fontWeight: 500 }}>
              Admin
            </Typography>

         
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <Logo src={whistlerLogo} />
          <List>
            <ListItem button sx={{ borderRadius: '8px', mb: 2 }}>
              <ListItemIcon sx={{ color: '#007bff' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 'bold' }} />
            </ListItem>

            <ListItem onClick={handleLogout} button sx={{ borderRadius: '8px', mb: 2 }}>
              <ListItemIcon sx={{ color: '#007bff' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Log out" primaryTypographyProps={{ fontWeight: 'bold' }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

   </>

      

  )
}

export default Header
