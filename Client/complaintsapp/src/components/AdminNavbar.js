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
import SearchIcon from '@mui/icons-material/Search';
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '60ch',
      },
    },
  }));
export default function AdminNavbar() {





  // const logout = () => {
  //     sessionStorage.deleteItem("jwt")
  //     window.location.reload()
  //     console.log("LOGOUT")
  // };
  function logout(){
    sessionStorage.removeItem("jwtkey")
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
          <Avatar sx={{ width: 50, height: 50,backgroundColor: '#1976d2'}}>
            X
          </Avatar>
        }
        title={
          <Typography gutterBottom  component="div">
          Emon Sarker
        </Typography>
        }
        subheader={"1931461642"}
        
      />
        <MenuItem onClick={()=>{window.location.href = '/profile';}}> <ManageAccountsIcon sx={{paddingRight: 1}}/> View profile</MenuItem>
        <MenuItem onClick={handleMenuClose}> <InfoIcon  sx={{paddingRight: 1}}/> Contact Support</MenuItem>
        <MenuItem onClick={handleMenuClose}><LogoutIcon sx={{paddingRight: 1}}/> Log out</MenuItem>

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
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            NSU Complaints App
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

           <Button
           onClick={()=>{logout()}}

           color="inherit">Logout</Button>

            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"

            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon
                 />
              </Badge>
            </IconButton>
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