import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { MenuItem } from '@mui/material';

import PrimarySearchAppBar from '../components/navbar';
import NavBar from '../components/complaintEditor'
import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';
import CreateComplaintCard from '../components/CompCard';
import TopDashCard from '../components/TopDashCard';

import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { Input } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from '../firebase';


import axios from 'axios';


const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function EditForm( fetchedData) {

 
  const [formdata, setFormdata] = React.useState('');

  const [backendData, setBackEndData] = React.useState([]);
  const [progress, setProgress] = useState(0);
  const [urldata, seturldata] = React.useState('');
  const [file2, setfile] = React.useState();
  
  

  React.useEffect(()=>{
    console.log(fetchedData)
    setBackEndData({

      complaintid: fetchedData.data.complaintid,
      creationdate: fetchedData.data.creationdate,
      status: fetchedData.data.status,
      title: fetchedData.data.title,
      against: fetchedData.data.against,
      // category: fetchedData.data.category,
      body: fetchedData.data.body,
      reviewer: fetchedData.data.reviewer,
      evidence: fetchedData.data.evidence

    })

    setFormdata(fetchedData.data.category)
   
 }, [])


 
//labib edit complaints
const formHandler = (e) => {
  //e.preventDefault();
  const file = e.target.files[0];
  setfile(file);
  console.log(file2);
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
        var sqlDatetime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toJSON().slice(0, 19).replace('T', ' ');
        console.log(sqlDatetime);
            axios.post('/editcomplaint', {
              complaintid:fetchedData.data.complaintid,
              title: data.get('title'),
              date:sqlDatetime,
              against: fetchedData.data.against,
              category: formdata,
              evidence:downloadURL,
              body: data.get('body'),
              reviewer: data.get('reviewer'),
              status:fetchedData.data.status

            }, {
              headers: {
                "x-access-token": sessionStorage.getItem("jwtkey")
              },
            }
            )
            // .then(function (response) {
            //   console.log(response);
            //   // fetchComplaint();
            //   // unExpandForm();
            // })
            // .catch(function (error) {
            //   console.log(error);
            //   alert(error);
            // });
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

  const handleChange = (event) => {
    setFormdata(event.target.value);
  };

 
  return (
    <>
     
    

      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        
        <TextField
          multiline={true}
          margin="normal"
          required
          fullWidth
          id="title"
          label="Write a complaint"
          name="title"
          autoComplete="title"
          autoFocus
          variant="standard"
          size="medium"
          defaultValue={backendData.title}
        />

        {/* <TextField
          multiline={true}
          margin="normal"
          required
          fullWidth
          name="against"
          label="Who is it against?"
          type="against"
          id="against"
          autoComplete="against"
          defaultValue={backendData.against}
        /> */}
      
      <Typography variant="body1" label="Who is it against?" color="text.disabled" >
      Against: {backendData.against} 
     
</Typography>
<br></br>

        <FormControl fullWidth>
          <InputLabel id="categories">Category*</InputLabel>
            <Select
              labelId="category"
              id="category"
              value={formdata}
              label="category"
              onChange={handleChange}
              defaultValue={formdata}
            >
              <MenuItem value={"Course Registration"}>Course registration</MenuItem>
              <MenuItem value={"Exam"}>Exam</MenuItem>
              <MenuItem value={"Result Compilation"}>Result compilation</MenuItem>
              <MenuItem value={"Student Welfare"}>Student welfare</MenuItem>
              <MenuItem value={"Student Lecturers Relationship"}>Student lecturers relationship</MenuItem>
              <MenuItem value={"Research Projects"}>Research projects</MenuItem>
              
            </Select>
        </FormControl>
  
          
    
        <TextField
          multiline={true}
          margin="normal"
          required
          fullWidth
          name="body"
          label="body"
          type="body"
          id="body"
          autoComplete="Body"
          rows={5}
          defaultValue={backendData.body}
        />
  
        <TextField
          multiline={true}
          margin="normal"
          required
          fullWidth
          name="reviewer"
          label="Who will review it?"
          type="reviewer"
          id="reviewer"
          autoComplete="reviewer"
          defaultValue={backendData.reviewer}
        />
    

        <div>
        <input onChange={formHandler} type="file" className="input" />
        <h2>Uploading done{progress}%</h2>
        </div>
   
        
 
      <Box sx={{display: "flex",
      justifyContent: "flex-end",
                alignItems: "flex-end"}}
                >
                
      <Button  variant="outlined" type="submit"  >
        Submit Edit
      </Button>
      
      </Box>
            
      </Box>
      </>
   
  );
}
  
      
      
    
 

