import * as React from 'react';
import {useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PrimarySearchAppBar from '../components/navbar';
import Profilecard from '../components/Profilecard';
import MiniCompCard from '../components/MiniCompCard';
import { Card } from '@mui/material';
import { Grid } from '@mui/material';

import { MenuList, MenuItem, ListItemText } from '@mui/material';

import axios from 'axios';

export default function Profile() {

  const [user, setUser] = useState({})

  useEffect(()=>{
    
    fetchUserInfo();
    
  }, [])

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

<Grid container spacing={2} sx={{maxWidth: 900}}>
      <Grid item xs={5} >
        <Card>
            <img className="profileId" src={user.idscan}/>
          </Card>
      </Grid>
      <Grid item xs={7} >
        <Card sx={{margin: 3, padding: 3}}>
        <Typography component="h1" variant="h5"alignItems={'center'} >
            Account Information
          </Typography>
        <MenuList>
                
                <MenuItem>
                <ListItemText >Name: {user.name} </ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText >ID: {user.nsuid}</ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText > Email: {user.email} </ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText > Role: {user.role} </ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText > Account: {user.status} </ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText > Joined: {user.createdAt} </ListItemText>
                </MenuItem>
                <MenuItem>
                </MenuItem>
           
               
            </MenuList>
          </Card>
      </Grid>
    </Grid>

          
        

        </Box>




    </React.Fragment>
  );
}
