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
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from '../firebase';
import { Button } from '@mui/material';

import { MenuList, MenuItem, ListItemText } from '@mui/material';

import axios from 'axios';

export default function Profile() {

  const [user, setUser] = useState({})
  const [progress, setProgress] = useState(0);
  const [urldata, seturldata] = React.useState('');
  const [file2, setfile] = React.useState();
  

  useEffect(()=>{
    
    fetchUserInfo();
    
  }, [])
  const formHandler = (e) => {
    //e.preventDefault();
    const file = e.target.files[0];
    setfile(file);
    console.log(file2);
  };
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
  
  const uploadFiles = (file,data) => {
    //
    if (!file) return;
    const sotrageRef = ref(storage, `profilepicture/${file.name}`);
    const uploadTask =  uploadBytesResumable(sotrageRef, file);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          
          seturldata(""+downloadURL);
          console.log(downloadURL)
          
              axios.put('/uploadprofilepic', {
              
                photo:downloadURL
  
              }, {
                headers: {
                  "x-access-token": sessionStorage.getItem("jwtkey")
                },
              }
              )
              
              document.getElementById("myForm").reset();
       
        });
      }
    );
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    uploadFiles(file2,data);
 
  
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
          <Typography component="h1" variant="h5"alignItems={'center'} >
            Upload profile Picture
          </Typography>
          <Box id="myForm" component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        
      

      
        <div>
        <input onChange={formHandler} type="file" className="input" />
        <h2>Uploading done{progress}%</h2>
        </div>
      
        
     
      <Box sx={{display: "flex",
      justifyContent: "flex-end",
                alignItems: "flex-end"}}
                >
    
      <Button  variant="outlined" type="submit" >
        Submit
      </Button>
      </Box>
     
      <Card>
            <img className="profilepic" src={user.photo}/>
          </Card>
        
      </Box>
      </Grid>
    </Grid>

          
        

        </Box>




    </React.Fragment>
  );
}
