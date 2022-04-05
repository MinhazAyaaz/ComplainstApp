import * as React from 'react';
import {useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PrimarySearchAppBar from '../components/navbar';
import Profilecard from '../components/Profilecard';
import MiniCompCard from '../components/MiniCompCard';

import axios from 'axios';

export default function Profile() {

  useEffect(()=>{
    
    fetchUserInfo();
    
  }, [])

  async function fetchUserInfo (){
    await axios.get('/getcomplaint/filed', {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        id: 12345
      }
    })
    .then(function (response) {
      console.log(response.data);
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
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <IconButton
          >
            <Avatar sx={{ width: 55, height: 55, alignItems: 'center',backgroundColor: '#1976d2'}}>M</Avatar>
          </IconButton>

            </Box>
          <Typography component="h1" variant="h5"alignItems={'center'} >
            Emon Sarker
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
