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

import Comment from '@mui/icons-material/Comment';

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


export default function CompCard( fetchedData ) {

  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [age, setAge] = React.useState('');
  const [backendData, setBackEndData] = React.useState([]);
  const [openDlg1Dialog, setDialog1Open] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [color2, setColor] = React.useState({})
  const [user, setUser] = React.useState({})
  const [comment, setComment] = React.useState();
  const [edit, setEdit] = React.useState();
  const [complaintVersions, setComplaintVersions] = React.useState([])

  const activeColor = { maxWidth: 900,  p: 3,
    margin: 'auto',
    marginTop: 1,
    padding: 3,
    paddingBottom: 1,
    maxWidth: 1000,
    flexGrow: 1,
    borderBottom: 'solid',
    borderWidth: 12,
    borderRadius: 2,
    borderColor: '#02a6d3'
    }
  
  const inactiveColor = { maxWidth: 900,  p: 3,
    margin: 'auto',
    marginTop: 1,
    padding: 3,
    paddingBottom: 1,
    maxWidth: 1000,
    flexGrow: 1,
    borderBottom: 'solid',
    borderWidth: 12,
    borderRadius: 2,
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
       evidence: fetchedData.fetchedData.evidence
     })
     
     fetchUserInfo()
     fetchComments()
     fetchComplaintVersions()


     if(fetchedData.fetchedData.status == '0'){
        setColor(activeColor)
     }
     else{
       setColor(inactiveColor)
     }
    
  }, [])

  

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

  async function fetchUserInfo (){
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
  }


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
      console.log(complaintVersions);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  
   
  
  }

  return (
    <Card sx={color2}>

      <CardHeader
        avatar={
          <Avatar src={user.idscan} sx={{ width: 45, height: 45,backgroundColor: '#1976d2'}}>
            
          </Avatar>
        }
        title={
          <Typography gutterBottom variant="h5" component="div">
          {backendData.title}
        </Typography>
        }
        subheader={"Created by: " + user.name +" ("+fetchedData.fetchedData.createdby+")"}
        action={
          <>
              
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={openMenu ? 'long-menu' : undefined}
                aria-expanded={openMenu ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: 48 * 4.5,
                    width: '20ch',
                  },
                }}
              >
                
                  <MenuItem onClick={handleClose}>
                    Edit Complaint
                  </MenuItem>
                  <MenuItem onClick={handleDelete}>
                    Delete Complaint
                  </MenuItem>
                
              </Menu>
            </>
        }
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
        {(backendData.status == 0) ? <p>Complaint status: <b>active</b> </p> : <p> Complaint status: <b>closed</b></p>}
        </ExpandMore>

        {( backendData.length === 0) ? (
        <p> Wait </p>
      ) : (
          <CompCardExpanded data={backendData} />
      )}

        



           </CardActions>

    </Card>
  );
}

