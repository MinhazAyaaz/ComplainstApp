
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

import { Dialog } from "@mui/material";
import { DialogContent } from "@mui/material";
import FileUpload from '../components/FileUpload';

import axios from 'axios';

import CircularProgress from '@mui/material/CircularProgress';
import AdminNavbar from '../components/AdminNavbar';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function Admin() {

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
  
 

  
  return (
    <>
      <AdminNavbar/>

     
      
    </>


  );
}