
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
import FileUpload from '../components/FileUpload';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from '../firebase';

import axios from 'axios';

import CircularProgress from '@mui/material/CircularProgress';
import { createWorker } from 'tesseract.js';
 
const worker = createWorker({
  logger: m => console.log(m)
});
 
(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function Dashboard() {

  const [open, setOpen] = useState(true)
  const [open2, setOpen2] = useState(true)
  const [role, setRole] = React.useState('');

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
  
  useEffect(()=>{
      checkIdStatus();
      checkRoleStatus();
      fetchComplaint();
      fetchUserList();
      fetchReviewerList();
      if( sessionStorage.getItem("role") == "2" || sessionStorage.getItem("role") == "3"){
        setReviewer(true)
      }
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
      console.log(sessionStorage.getItem("jwtkey"))
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

    await axios.get('/getcomplaint/review', {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        id: 12345
      }
    })
    .then(function (response) {
      console.log(response.data);
      setReviewComplaint(response.data)
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
    //API Endpoint '/findAll' is for testing only
    //
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

  async function fetchReviewerList ( value1 ){
    //API Endpoint '/findAll' is for testing only
    //
    console.log(value1.nsuid)
    await axios.get('/reviewertoreview', {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        id: value1.nsuid
      }
    })
    .then(function (response) {
      setReviewerList(response.data)
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

  async function checkRoleStatus (){
    await axios.get('/roleStatus', {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        id: 12345
      }
    })
    .then(function (response) {
      setOpen2(!response.data.findRole)
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }

  function updateRoleStatus(){
    
    axios.put('/updateStatus', {
      role: role
      
    },{headers: {
      "x-access-token": sessionStorage.getItem("jwtkey")
    },
    params: {
      id: 12345
    }}
    )
    .then(function (response) {
      console.log(response);
      sessionStorage.setItem("role", role)
      window.location.reload()
     
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });
  }

  //Complaint form rendering
  const expandForm = () =>{
    setExpanded(true);
  };
  const unExpandForm = () =>{
    setExpanded(false);
  };

  const clearForm = () =>{
    setExpanded(false);
  };

  const formHandler = (e) => {
    //e.preventDefault();
    const file = e.target.files[0];
    setfile(file);
    console.log(file2);
};

  //toogles which complaints to show
  const toggleFiledComplaint = () =>{
    if(showFiledComaplint == false){
      setShowFiledComaplint(true)
      setShowRecievedComplaint(false)
      setShowReviewComaplaint(false)
    }
  }
  const toggleRecievedComplaint = () =>{
    if(showRecievedComplaint == false){
      setShowFiledComaplint(false)
      setShowRecievedComplaint(true)
      setShowReviewComaplaint(false)
    }
  }
  const toggleReviewComplaint = () =>{
    if(showReviewComaplaint ==  false){
      setShowFiledComaplint(false)
      setShowRecievedComplaint(false)
      setShowReviewComaplaint(true)
    }
  }

  //Complaint lodging logic 
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console

    uploadFiles(file2,data);
    
    console.log({
      title: data.get('title'),
      against: value.nsuid,
      category: formdata,
      body: data.get('body'),
      reviewer: value2.nsuid,
    });
    
    // var sqlDatetime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toJSON().slice(0, 19).replace('T', ' ');

    // axios.post('/createcomplaint', {
    //   title: data.get('title'),
    //   date: sqlDatetime,
    //   against: value.nsuid,
    //   category: formdata,
    //   body: data.get('body'),
    //   reviewer: value2.nsuid,
    // }, {
    //   headers: {
    //     "x-access-token": sessionStorage.getItem("jwtkey")
    //   },
    // }
    // )
    // .then(function (response) {
    //   console.log(response);
    //   fetchComplaint();
    //   unExpandForm();
    // })
    // .catch(function (error) {
    //   console.log(error);
    //   alert(error);
    // });
    document.getElementById("myForm").reset();
    setFiledComplaint(empty)
    fetchComplaint();

  };

  const handleChange = (event) => {
    setFormdata(event.target.value);
  };

  const handleRole = (event) => {
    setRole(event.target.value);
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
          window.location.reload()
        /*   const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
              const blob = xhr.response;
            };
            xhr.open('GET', downloadURL);
            xhr.send(); */


            var sqlDatetime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toJSON().slice(0, 19).replace('T', ' ');

            axios.post('/createcomplaint', {
              title: data.get('title'),
              date: sqlDatetime,
              against: value.nsuid,
              category: formdata,
              body: data.get('body'),
              reviewer: value2.nsuid,
              evidence: downloadURL
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
        });
      }
    );
  };
  
  return (
    <>
      <PrimarySearchAppBar />

      
      <Card sx={{ maxWidth: 900,  p: 3,
      margin: 'auto',
      marginTop: 5,
      maxWidth: 1000,
      flexGrow: 1,}}>
    

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
            console.log(newValue)
            setValue(newValue)
            
              setReviewerList(empty)
              fetchReviewerList( newValue )
            
            
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
              <MenuItem value={"Course Registration"}>Course registration</MenuItem>
              <MenuItem value={"Exam"}>Exam</MenuItem>
              <MenuItem value={"Result Compilation"}>Result compilation</MenuItem>
              <MenuItem value={"Student Welfare"}>Student welfare</MenuItem>
              <MenuItem value={"Student Lecturers Relationship"}>Student lecturers relationship</MenuItem>
              <MenuItem value={"Research Projects"}>Research projects</MenuItem>
              
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
        {(reviewerList.length === 0) ? ( <p>Fetching reviewer list</p>) : (
          <Autocomplete
          disablePortal
          value={value2}
          onChange={(event, newValue) => {
            setValue2(newValue);
          }}
          options={reviewerList}
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
        <input onChange={formHandler} type="file" className="input" />
        <h2>Uploading done{progress}%</h2>
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

<Box sx={{maxWidth: 900,  p: 3,
      margin: 'auto',
      marginTop: 1,
      maxWidth: 1000,
      justifyContent:'center',
      flexGrow: 1}}>

  
  { reviewer ? (
  <>
    <Button sx={{fontSize: 20, paddingLeft: 10}} onClick={()=>{toggleFiledComplaint()}}>Complaints Filed ({filedComplaint.length})</Button>
    <Button sx={{fontSize: 20, paddingLeft: 10}} onClick={()=>{toggleRecievedComplaint()}}>Complaints Received ({receivedComplaint.length})</Button>
    <Button sx={{fontSize: 20, paddingLeft: 10}} onClick={()=>{toggleReviewComplaint()}}>Review Pending ({reviewComplaint.length})</Button>
  
  </>
  ) : (
  <>
    <Button sx={{fontSize: 20, paddingLeft: 20}} onClick={()=>{toggleFiledComplaint()}}>Complaints Filed ({filedComplaint.length})</Button>
    <Button sx={{fontSize: 20, paddingLeft: 20}} onClick={()=>{toggleRecievedComplaint()}}>Complaints Received ({receivedComplaint.length})</Button>
  </>
  )
  
  }

  </Box> 

    { showFiledComaplint ? <>
      
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
      
      </>
      : null}
      
      { showRecievedComplaint ? <>
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
      : null}

      { showReviewComaplaint ? <>
      {( reviewComplaint.length === 0) ? (
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
       align="center" > Complaints Received // {reviewComplaint.length} complaints</Typography>
        {reviewComplaint.map((data, i) => (
          <>
          <AdminCompCard fetchedData={data}/>
          
          </>
        ))}
      </>
      )}

      </>
      : null}
      
    </>


  );
}
