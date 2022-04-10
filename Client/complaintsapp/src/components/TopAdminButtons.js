import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';

import PrimarySearchAppBar from './navbar';
import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import CreateComplaintCard from './CompCard';

import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { Input } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Autocomplete from '@mui/material/Autocomplete';

import { Dialog } from "@mui/material";
import { DialogContent } from "@mui/material";
import FileUpload from './FileUpload';
import Grid from '@mui/material/Grid';
import DialogContentText from '@mui/material/DialogContentText';


import axios from 'axios';

import CircularProgress from '@mui/material/CircularProgress';
import AdminNavbar from './AdminNavbar';
import { CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import AdminAddAccount from './AdminAddAccount';
import AdminDisableAccountTable from './AdminDisableAccountTable';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});



export default function TopAdminButtons() {
  const [open, setOpen] = useState();
  const [open2, setOpen2] = useState();
 
 
  
 

  
  return (
    <>
    <Dialog open={open && open === "first"} fullWidth="true" maxWidth="lg">
    
    <DialogContent >
    <IconButton onClick={() => setOpen(null)}>
                <CloseIcon />
              </IconButton>
          
          <AdminAddAccount/>
        
       
        </DialogContent>
      
      
    </Dialog>
    <Dialog open={open2 && open2 === "first"} fullWidth="true" maxWidth="lg">
    
    <DialogContent >
    <IconButton onClick={() => setOpen2(null)}>
                <CloseIcon />
              </IconButton>
      
          <AdminDisableAccountTable/>
       
        </DialogContent>
      
      
    </Dialog>
     
  
       <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        
        <Grid item xs={5}>
        <Card  onClick={() => setOpen("first")}sx={{ maxWidth: 300,marginLeft:42,marginTop:10,backgroundColor:'#1976d2'}}>
      
      <CardActionArea>
       
        <CardContent>
          
          <Typography sx={{textAlign:'center'}} variant="h5" color="common.white" >
            Add Account
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
        </Grid>
        <Grid item xs={6} >
        <Card sx={{ maxWidth: 300 ,marginRight:10,marginTop:10,backgroundColor:'#1976d2'}}>
      <CardActionArea>
       
        <CardContent>
          
          <Typography onClick={() => setOpen2("first")} sx={{textAlign:'center'}} variant="h5" color="common.white" >
            Disable Account
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
        </Grid>
      </Grid>
    </Box> 
      

    

     
      
    </>


  );
}