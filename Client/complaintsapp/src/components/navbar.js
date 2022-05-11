import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Button } from '@mui/material';
import { Avatar, Card, CardHeader } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';

import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from '@mui/icons-material/Info';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ForumIcon from '@mui/icons-material/Forum';

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function PrimarySearchAppBar() {

  const [user, setUser] = useState({})

  useEffect(() => {
    fetchUserInfo()
  }, [])
  


  // const logout = () => {
  //     sessionStorage.deleteItem("jwt")
  //     window.location.reload()
  //     console.log("LOGOUT")
  // };
  function logout(){
    sessionStorage.removeItem("jwtkey")
    sessionStorage.removeItem("role")
    window.location.reload()
    console.log("LOGOUT")
  }



  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);


  const isMenuOpen = Boolean(anchorEl);


  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    
  };

  async function fetchUserInfo (){
    await axios.get('/user', {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        id: 12345
      }
    })
    .then(function (response) {
      console.log(response.data);
      setUser(response.data)
      // setFiledComplaint(response.data)
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }





  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Card>
      
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ width: '550', height: 1000}}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <CardHeader
        avatar={
          <Avatar src={user.photo} sx={{ width: 50, height: 50,backgroundColor: '#1976d2'}}>
            X
          </Avatar>
        }
        title={
          <Typography gutterBottom  component="div">
          {user.name}
        </Typography>
        }
        subheader={user.nsuid}
        
      />
        <MenuItem onClick={()=>{window.location.href = '/profile';}}> <ManageAccountsIcon sx={{paddingRight: 1}}/> View profile</MenuItem>

        <MenuItem onClick={()=>{logout()}}><LogoutIcon sx={{paddingRight: 1}}/> Log out</MenuItem>

      </Menu>
    </Card>
  );



  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, '&:hover': {cursor: 'pointer'} }}
            onClick={()=>{window.location.href = '/dashboard'}}
          >
            <ForumIcon sx={{marginTop: 1}}/> NSU Complaints App
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

           

            
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >

              <AccountCircle />
            </IconButton>
          </Box>

        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}
