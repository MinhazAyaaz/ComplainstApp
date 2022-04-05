
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

import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { Input } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Autocomplete from '@mui/material/Autocomplete';

import { Dialog } from "@mui/material";
import { DialogContent } from "@mui/material";
import FileUpload from '../components/FileUpload';

import axios from 'axios';

import CircularProgress from '@mui/material/CircularProgress';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function Dashboard() {

  const [open, setOpen] = useState(true)
  const [backendData, setBackEndData] = useState([])
  const [filedComplaint, setFiledComplaint] = useState([])
  const [receivedComplaint, setReceivedComplaint] = useState([])
  const [empty, dempty] = useState([])
  const [expanded, setExpanded] = React.useState(false);
  const [formdata, setFormdata] = React.useState('');
  const [studentList, setStudentList] = useState([]);
  const [value, setValue] = useState({name: "", nsuid: ""})
  const [value2, setValue2] = useState({name: "", nsuid: ""})
  
  useEffect(()=>{
    checkIdStatus();
      fetchComplaint();
      fetchUserList();
  }, [])

  async function fetchComplaint (){
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
      setFiledComplaint(response.data)
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });

    await axios.get('/getcomplaint/received', {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        id: 12345
      }
    })
    .then(function (response) {
      console.log(response.data);
      setReceivedComplaint(response.data)
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

  async function fetchUserList (){
    await axios.get('/users', {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        id: 12345
      }
    })
    .then(function (response) {
      setStudentList(response.data)
      console.log(studentList)
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }

  async function checkIdStatus (){
    await axios.get('/idStatus', {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        id: 12345
      }
    })
    .then(function (response) {
      setOpen(!response.data.findID)
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
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
      against: value.nsuid,
      category: formdata,
      body: data.get('body'),
      reviewer: value2.nsuid,
    });
    
    axios.post('/createcomplaint', {
      title: data.get('title'),
      against: value.nsuid,
      category: formdata,
      body: data.get('body'),
      reviewer: value2.nsuid,
    }, {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
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

      <Dialog open={open}  maxWidth="lg">
    
        <DialogContent>
          <FileUpload/>
        </DialogContent>
          
      </Dialog>

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


        {expanded ? <>
          <br/> <br/> 
        {(studentList.length === 0) ? ( <p>Fetching user list</p>) : (
          <Autocomplete
          disablePortal
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          options={studentList}
          getOptionLabel={(option) => option.name}
          sx={{ width: 'max' }}
          renderOption={(props, option) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              {option.name} ({option.nsuid})
            </Box>
          )}
          renderInput={(params) => <TextField {...params} label="Who is the complaint against" />}
          
        />
        )}
        <br/> 
        </>
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
        <>
        {(studentList.length === 0) ? ( <p>Fetching user list</p>) : (
          <Autocomplete
          disablePortal
          value={value2}
          onChange={(event, newValue) => {
            setValue2(newValue);
          }}
          options={studentList}
          getOptionLabel={(option) => option.name}
          sx={{ width: 'max' }}
          renderOption={(props, option) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              {option.name} ({option.nsuid})
            </Box>
          )}
          renderInput={(params) => <TextField {...params} label="Who will review the complaint" />}
          
        />
        )}
        </>
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
      
      {( filedComplaint.length === 0) ? (
        <p> </p>
      ) : (
        <>
        <Typography sx={{ maxWidth: 900,  p: 3,
          color: '#888',
          margin: 'auto',
          fontSize: 25,
          borderBottom: 'solid',
          borderColor: '#888',
          padding: 1,
          paddingTop: 3,
          maxWidth: 1000,
          flexGrow: 1,
       }}
       align="center" > Complaints Filed // {filedComplaint.length} posted</Typography>

        {filedComplaint.map((data, i) => (
          <CompCard fetchedData={data}/>
        ))}
        </>
      )}

      
      {( receivedComplaint.length === 0) ? (
        <p></p>
      ) : (
      <>
        <Typography sx={{ maxWidth: 900,  p: 3,
        color: '#888',
        margin: 'auto',
        fontSize: 25,
        borderBottom: 'solid',
        borderColor: '#888',
        padding: 1,
        paddingTop: 3,
        maxWidth: 1000,
        flexGrow: 1,
       }}
       align="center" > Complaints Received // {receivedComplaint.length} complaints</Typography>
        {receivedComplaint.map((data, i) => (
          <CompCardReceived fetchedData={data}/>
        ))}
      </>
      )}
      
    </>


  );
}
