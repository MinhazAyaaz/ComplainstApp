
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
import AdminNavbar from '../components/AdminNavbar';
import TopAdminButtons from '../components/TopAdminButtons';
import AdminTopCompCard from '../components/AdminTopCompCard';
import AdminAddAccount from '../components/AdminAddAccount';

import { Dialog } from "@mui/material";
import { DialogContent } from "@mui/material";
import FileUpload from '../components/FileUpload';

import axios from 'axios';

import CircularProgress from '@mui/material/CircularProgress';
import AdminFiledCompCard from '../components/AdminFiledCompCard';

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
    await axios.get('/againstusers', {
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
      <AdminNavbar />
      <TopAdminButtons/>
      <AdminTopCompCard/>
      <AdminFiledCompCard/>
    

      
     
      
    </>


  );
}
