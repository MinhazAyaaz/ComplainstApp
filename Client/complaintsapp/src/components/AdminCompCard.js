import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Badge } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import { MenuItem } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import Menu from '@mui/material/Menu';
import AdminCompCardExpanded from './AdminCompCardExpanded';
import SwitchComp from "./SwitchComp";
import { Button } from '@mui/material';
import Switch from '@mui/material/Switch';
import { Grid } from '@mui/material';

import Dialogs from './Dialogs';
import CompCardExpanded from './CompCardExpanded';

import { Alert } from '@mui/material';

import axios from 'axios';


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(0deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


export default function AdminCompCard( fetchedData ) {

  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [edit, setEdit] = React.useState();
  const [backendData, setBackEndData] = React.useState([]);
  const [openDlg1Dialog, setDialog1Open] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [checked, setChecked] = React.useState();
  const [comment, setComment] = React.useState();
  const [color2, setColor] = React.useState({})
  const [myColor, setmyColor] = React.useState('white');
  const [user, setUser] = React.useState({})
  const [userAgaisnt, setUserAgaisnt] = React.useState({})
  const [userReviewer, setUserReviewer] = React.useState({})
  const activeColor = { maxWidth: 900,  p: 3,
    margin: 'auto',
    marginTop: 1,
    padding: 3,
    maxWidth: 1000,
    flexGrow: 1,
    borderBottom: 'solid',
    borderWidth: 17,
    borderRadius: 10,
    borderColor: '#02a6d3'
    }
  
  const inactiveColor = { maxWidth: 900,  p: 3,
    margin: 'auto',
    marginTop: 1,
    padding: 3,
    maxWidth: 1000,
    flexGrow: 1,
    borderBottom: 'solid',
    borderWidth: 17,
    borderRadius: 10,
    borderColor: '#555'
    }
    
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  React.useEffect(()=>{

    setBackEndData({

       complaintid: fetchedData.fetchedData.complaintid,
       creationdate: fetchedData.fetchedData.creationdate,
       status: fetchedData.fetchedData.status,
       title: fetchedData.fetchedData.title,
       against: fetchedData.fetchedData.against,
       category: fetchedData.fetchedData.category,
       body: fetchedData.fetchedData.body,
       reviewer: fetchedData.fetchedData.reviewer,
       createdby: fetchedData.fetchedData.createdby,
       status:fetchedData.fetchedData.status,
       evidence: fetchedData.fetchedData.evidence
     })
    //  console.log(fetchedData.fetchedData.)
     fetchComments()
     fetchUserInfo()
     fetchComplaintVersions()
     setChecked(!fetchedData.fetchedData.status)

     if(fetchedData.fetchedData.status == '0'){
       setmyColor('#02a6d3')
     }
     else{
       setmyColor('#555')
     }
    
  }, [])

  
  async function fetchUserInfo (){

    //Get data of creator
    await axios.get('/otherUser', {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        id: fetchedData.fetchedData.createdby
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
  
    //Get data of the user complaint is lodged agaisnt
    await axios.get('/otherUser', {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        id: fetchedData.fetchedData.against
      }
    })
    .then(function (response) {
      console.log(response.data);
      setUserAgaisnt(response.data)
      // setFiledComplaint(response.data)
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  
    //Get data of reviewer of the complaint
    await axios.get('/otherUser', {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        id: fetchedData.data.reviewer
      }
    })
    .then(function (response) {
      console.log(response.data);
      setUserReviewer(response.data)
      // setFiledComplaint(response.data)
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDelete = () => {
    
    
    axios.post('/deletecomplaint', {
      id: backendData.complaintid
    })
    .then(function (response) {
      console.log(response);
      window.location.reload()
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });
    
  };

  async function fetchComments (){
    //API Endpoint '/findAll' is for testing only
    //
    console.log(fetchedData.fetchedData.complaintid)
      await axios.get('/fetchComment', {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        complaintid: fetchedData.fetchedData.complaintid
      }
    })
    .then(function (response) {
      setComment(response.data.length)
      console.log(comment)
      console.log(response.data)
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
      
    });
  };

  async function fetchComplaintVersions (){
    await axios.get('/getcomplaintVersions', {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        id: 12345,
        complaintid:fetchedData.fetchedData.complaintid
      }
    })
    .then(function (response) {
      console.log("from edit  history");
      // console.log(response.data);
      setEdit(response.data.length)
      // console.log(complaintVersions);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  
   
  
  }

  const handleChange3 = (event) => {
    axios.put('/updatecompstat', {
      complaintid: backendData.complaintid,
      status: backendData.status
    })
    .then(function (response) {
      console.log(response);
      // window.location.reload()
      if(color2 === activeColor){
        setColor(inactiveColor)
      }
      else if(color2 === inactiveColor){
        setColor(activeColor)
      }
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });
    setChecked(event.target.checked);
    if(myColor == '#02a6d3'){
      setmyColor('#555')
    }
    else if(myColor == '#555'){
      setmyColor('#02a6d3')
    }
    
  };


  return (

    (color2 == null) ? null :
    <Card sx={{ maxWidth: 900,  p: 3,
      margin: 'auto',
      marginTop: 1,
      padding: 3,
      maxWidth: 1000,
      flexGrow: 1,
      borderBottom: 'solid',
      borderWidth: 15,
      borderRadius: 5,
      borderColor: `${ myColor }`
      }}>
           

      <CardHeader
        avatar={
          <Avatar src={user.photo} sx={{ width: 45, height: 45,backgroundColor: '#1976d2'}}>
            
          </Avatar>
        }
        title={
          <Typography gutterBottom variant="h5" component="div">
          {backendData.title}
        </Typography>
        }
        subheader={"Created by: " + user.name +" ("+fetchedData.fetchedData.createdby+")"}
        
      />
      
      <CardContent>
      
        <Typography variant="body2" color="text.secondary">
        {backendData.body}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
      <IconButton
        size="large"
        aria-label="show 17 new notifications"
      >

        <Badge badgeContent={comment} color="error" size="small" sx={{ marginRight:4}} >
          <CommentIcon sx={{ color:'#1976d2',marginRight:1}}
        />

              </Badge>
              <Badge badgeContent={edit} color="error" >
                <EditIcon sx={{ color:'#1976d2',marginRight:1 }}
                 />

              </Badge>
            </IconButton>
           
            <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          

<Grid component="label" container alignItems="center" spacing={1}>
        <Grid item >Closed</Grid>
        <Grid item>
        <Switch
   
   checked={checked}
   onChange={handleChange3}
   inputProps={{ 'aria-label': 'controlled' }}
 />
        </Grid>
        <Grid item>Active</Grid>
      </Grid>
      
        </ExpandMore>
      

        {( backendData.length === 0) ? (
        <p> Wait </p>
      ) : (
          <AdminCompCardExpanded data={backendData} />
      )}

        



           </CardActions>

    </Card>
  );
}
