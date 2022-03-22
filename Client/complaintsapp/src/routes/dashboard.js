
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MenuItem } from '@mui/material';

import PrimarySearchAppBar from '../components/navbar';
import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import CreateComplaintCard from '../components/CompCard';

import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { Input } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Autocomplete from '@mui/material/Autocomplete';

import axios from 'axios';

import CircularProgress from '@mui/material/CircularProgress';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function Dashboard() {

  const [backendData, setBackEndData] = useState([])
  const [filedComplaint, setFiledComplaint] = useState([])
  const [receivedComplaint, setReceivedComplaint] = useState([])
  const [empty, dempty] = useState([])
  const [expanded, setExpanded] = React.useState(false);
  const [formdata, setFormdata] = React.useState('');
  const [studentList, setStudentList] = useState([]);

  useEffect(()=>{

      fetchComplaint();
      
  }, [])

  async function fetchComplaint (){
    await axios.get('/getcomplaint/filed', {
      headers: {
        authorization: 'Bearer ' + sessionStorage.getItem("jwtkey")
      },
      params: {
        id: 12345
      }
    })
    .then(function (response) {
      console.log(response.data);
      setFiledComplaint(response.data)
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });

    // await axios.get('/getcomplaint/received', {
    //   headers: {
    //     authorization: 'Bearer ' + sessionStorage.getItem("jwtkey")
    //   },
    //   params: {
    //     id: 12345
    //   }
    // })
    // .then(function (response) {
    //   console.log(response.data);
    //   setBackEndData(response.data)
    // })
    // .catch(function (error) {
    //   console.log(error);
    // })
    // .then(function () {
    //   // always executed
    // });
  }

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
    }, {
      headers: {
        authorization: 'Bearer ' + sessionStorage.getItem("jwtkey")
      },
    }
    )
    .then(function (response) {
      console.log(response);
      fetchComplaint();
      unExpandForm();
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });
    document.getElementById("myForm").reset();
    setFiledComplaint(empty)
    fetchComplaint();
  };

  const handleChange = (event) => {
    setFormdata(event.target.value);
  };

  
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
    

      <Box id="myForm" component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        
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

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={studentList}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Movie" />}
        />

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
      <Typography sx={{ maxWidth: 900,  p: 3,
      color: '#555555',
      margin: 'auto',
      fontSize: 25,
      borderBottom: 'solid',
      borderColor: '#777777',
      padding: 1,
      paddingTop: 3,
      maxWidth: 1000,
      flexGrow: 1,
       }}
       align="center" > Complaints Filed // {filedComplaint.length} posted</Typography>
      {( filedComplaint.length === 0) ? (
        <p> Wait </p>
      ) : (
        filedComplaint.map((data, i) => (
          <CreateComplaintCard fetchedData={data}/>
        ))
        
      )}

      <Typography sx={{ maxWidth: 900,  p: 3,
        color: '#555555',
        margin: 'auto',
        fontSize: 25,
        borderBottom: 'solid',
        borderColor: '#777777',
        padding: 1,
        paddingTop: 3,
        maxWidth: 1000,
        flexGrow: 1,
       }}
       align="center" > Complaints Received // {receivedComplaint.length} complaints</Typography>
      {( receivedComplaint.length === 0) ? (
        <CircularProgress />
      ) : (
        receivedComplaint.map((data, i) => (
          <CreateComplaintCard fetchedData={data}/>
        ))
        
      )}
      
    </>


  );
}
