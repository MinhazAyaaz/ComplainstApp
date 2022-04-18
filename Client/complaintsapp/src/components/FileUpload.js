import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MenuItem } from '@mui/material';

import PrimarySearchAppBar from '../components/navbar';
import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import CompCard from '../components/CompCard';
import CompCardReceived from '../components/CompCardReceived';
import AdminCompCard from '../components/AdminCompCard';

import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { Input } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Autocomplete from '@mui/material/Autocomplete';

import { Dialog } from "@mui/material";
import { DialogContent } from "@mui/material";

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from '../firebase';

import axios from 'axios';

import CircularProgress from '@mui/material/CircularProgress';


function FileUpload() {

  const [open, setOpen] = useState(true)
  const [backendData, setBackEndData] = useState([])
  const [filedComplaint, setFiledComplaint] = useState([])
  const [receivedComplaint, setReceivedComplaint] = useState([])
  const [reviewComplaint, setReviewComplaint] = useState([])
  const [empty, dempty] = useState([])
  const [expanded, setExpanded] = React.useState(false);
  const [formdata, setFormdata] = React.useState('');
  const [studentList, setStudentList] = useState([]);
  const [reviewerList, setReviewerList] = useState([]);

  const [value, setValue] = useState({name: "", nsuid: ""})
  const [value2, setValue2] = useState({name: "", nsuid: ""})
  const [reviewer, setReviewer] = useState(false)
  const [showFiledComaplint, setShowFiledComaplint] = useState(true)
  const [showRecievedComplaint, setShowRecievedComplaint] = useState(false)
  const [showReviewComaplaint, setShowReviewComaplaint] = useState(false)

  const [progress, setProgress] = useState(0);
  const [urldata, seturldata] = React.useState('');
  const [file2, setfile] = React.useState();
  
  

  
  const formHandler = (e) => {
    //e.preventDefault();
    const file = e.target.files[0];
    setfile(file);
    console.log(file2);
};

  //toogles which complaints to show
  

  //Complaint lodging logic 
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console

    uploadFiles(file2,data);
    
   
    
   
    document.getElementById("myForm").reset();
   
  };

  const handleChange = (event) => {
    setFormdata(event.target.value);
  };

  const uploadFiles = (file,data) => {
    //
    if (!file) return;
    const sotrageRef = ref(storage, `evidences/${file.name}`);
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
        /*   const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
              const blob = xhr.response;
            };
            xhr.open('GET', downloadURL);
            xhr.send(); */
            axios.put('/uploadstuff', {
              idscan: downloadURL
              
            },{headers: {
              "x-access-token": sessionStorage.getItem("jwtkey")
            },
            params: {
              id: 12345
            }}
            )
            .then(function (response) {
              console.log(response);
              window.location.reload()
             
            })
            .catch(function (error) {
              console.log(error);
              alert(error);
            });


           

        
        });
      }
    );
  };
  
  return (
    <>
      

      <Card sx={{ maxWidth: 900,  p: 3,
      margin: 'auto',
      marginTop: 5,
      maxWidth: 1000,
      flexGrow: 1,}}>
    

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
    
        
      </Box>
      
      
    
  </Card>


    </>


  );
}
export default FileUpload;
