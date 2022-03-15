
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

import axios from 'axios';


const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function Dashboard() {

  const [backendData, setBackEndData] = useState([])
  const [expanded, setExpanded] = React.useState(false);
  const [formdata, setFormdata] = React.useState('');


  useEffect(()=>{

      fetchComplaint();
    
  }, [])

  const expandForm = () =>{
    setExpanded(true);
  };
  const unExpandForm = () =>{
    setExpanded(false);
  };

  const clearForm = () =>{
    setExpanded(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console

    console.log({
      title: data.get('title'),
      against: data.get('against'),
      category: formdata,
      body: data.get('body'),
      reviewer: data.get('reviewer'),
    });
    
    axios.post('/createcomplaint', {
      title: data.get('title'),
      against: data.get('against'),
      category: formdata,
      body: data.get('body'),
      reviewer: data.get('reviewer'),
    })
    .then(function (response) {
      console.log(response);
      fetchComplaint();
      unExpandForm();
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });
    
    setTimeout(fetchComplaint(), 5000);
  };

  const handleChange = (event) => {
    setFormdata(event.target.value);
  };

  function fetchComplaint (){
    axios.get('/getcomplaint', {
      params: {
        ID: 12345
      }
    })
    .then(function (response) {
      console.log(response.data);
      setBackEndData(response.data)
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }
  return (
    <>
      <PrimarySearchAppBar />

      <Card sx={{ maxWidth: 900,  p: 3,
      margin: 'auto',
      marginTop: 5,
      maxWidth: 1000,
      flexGrow: 1,
       
      backgroundColor: (theme) =>
        theme.palette.mode === 'dark' ? '#1A2027' : '#fff'}}>
    

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
          onClick={expandForm}
        />

        {expanded ? 
        <TextField
          margin="normal"
          required
          fullWidth
          name="against"
          label="Who is it against?"
          type="string"
          id="against"
          autoComplete="against"
        />
        :null}

        {expanded ? 
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Category*</InputLabel>
            <Select
              labelId="category"
              id="category"
              value={formdata}
              label="category"
              onChange={handleChange}
            >
              <MenuItem value={"bullying"}>Bullying</MenuItem>
              <MenuItem value={"sanitation"}>Sanitation</MenuItem>
              
            </Select>
        </FormControl>
        :null}
          
        {expanded ?
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
        />
        :null}

        {expanded ?
        <TextField
          margin="normal"
          required
          fullWidth
          name="reviewer"
          label="Who will review it?"
          type="reviewer"
          id="reviewer"
          autoComplete="reviewer"
        />
        :null}

        {expanded ?
        <div>
        <Input accept="image/*" label="Evidence" id="icon-button-file" type="file"/>
        <AttachFileIcon/>
        </div>
        :null}
        
        {expanded ?
      <Box sx={{display: "flex",
      justifyContent: "flex-end",
                alignItems: "flex-end"}}
                >
    <Button  variant="filled" onClick={unExpandForm} >
        Cancel
      </Button>
      <Button  variant="outlined" type="submit" >
        Submit
      </Button>
      </Box>
      :null}
        
      </Box>
      
      
    
  </Card>

      {( backendData.length === 0) ? (
        <p> Wait </p>
      ) : (
        backendData.map((data, i) => (
          <CreateComplaintCard fetchedData={data}/>
        ))
        
      )}
      
    </>








  );
}
