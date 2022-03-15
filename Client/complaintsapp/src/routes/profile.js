import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import LockIcon from '@mui/icons-material/Lock';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PrimarySearchAppBar from '../components/navbar';
import Profilecard from '../components/Profilecard';
import MiniCompCard from '../components/MiniCompCard';

export default function Profile() {



  return (

    <React.Fragment>
        <PrimarySearchAppBar/>


      <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <IconButton
          >
            <Avatar sx={{ width: 55, height: 55, alignItems: 'center',backgroundColor: '#1976d2'}}>M</Avatar>
          </IconButton>

            </Box>
            <Typography component="h1" variant="h5"alignItems={'center'} >
            Profile
          </Typography>
            <Profilecard/>
            <Typography component="h3" variant="h7"alignItems={'center'} marginTop={5}>
            Complaints Filed
          </Typography>
            <MiniCompCard/>
            <MiniCompCard/>


        </Box>




    </React.Fragment>
  );
}
