import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Dialog } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { DialogContent } from "@mui/material";
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import { MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import Menu from '@mui/material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DialogContentText from '@mui/material/DialogContentText';
import FilePresentIcon from '@mui/icons-material/FilePresent';

import { blue } from '@mui/material/colors';
import AssignmentIcon from '@mui/icons-material/Assignment';

import CompDetails from "./CompDetails";
import axios from "axios";

import Comment from "./Comment";
import CommentView from "./CommentView";

import ListItemText from '@mui/material/ListItemText';
import EditForm from "./EditForm";

export default function CompCardExpanded( fetchedData ) {
  
  const [open, setOpen] = useState();
  const [complaintVersions, setComplaintVersions] = useState([])
  const [backendData, setBackEndData] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = React.useState({})
  const [userAgaisnt, setUserAgaisnt] = React.useState({})
  const [userReviewer, setUserReviewer] = React.useState({})

  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  React.useEffect(()=>{
    console.log(fetchedData)
    
    setBackEndData({
      createdby: fetchedData.data.createdby,
      complaintid: fetchedData.data.complaintid,
      creationdate: fetchedData.data.createdAt,
      status: fetchedData.data.status,
      title: fetchedData.data.title,
      against: fetchedData.data.against,
      category: fetchedData.data.category,
      body: fetchedData.data.body,
      reviewer: fetchedData.data.reviewer,
      evidence: fetchedData.data.evidence
    })

    fetchUserInfo()
    fetchComplaintVersions();
   
 }, [])

 const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}

async function fetchUserInfo (){

  //Get data of creator
  await axios.get('/otherUser', {
    headers: {
      "x-access-token": sessionStorage.getItem("jwtkey")
    },
    params: {
      id: fetchedData.data.createdby
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
      id: fetchedData.data.against
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

 async function fetchComplaintVersions (){
  await axios.get('/getcomplaintVersions', {
    headers: {
      "x-access-token": sessionStorage.getItem("jwtkey")
    },
    params: {
      id: 12345,
      complaintid:fetchedData.data.complaintid
    }
  })
  .then(function (response) {
    console.log("from edit  history");
    // console.log(response.data);
    setComplaintVersions(response.data);
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
    <>
      <Button onClick={() => setOpen("first")}variant="outlined"s>
        Show More
      </Button>

      <Dialog open={open && open === "first"} fullWidth="true" maxWidth="lg"  sx={{overflow: "scroll"}}>
      <Card >
        <CardHeader
          avatar={
            <Avatar src={user.photo} sx={{ width: 45, height: 45,backgroundColor: '#1976d2'}}>
              X
            </Avatar>
          }
          title={
            <Typography gutterBottom variant="h5" component="div">
            {backendData.title}
          </Typography>
          }
          subheader={user.name +" ("+ user.nsuid +")"}
          action={
            <>
              <IconButton onClick={() => setOpen(null)}>
                <CloseIcon />
              </IconButton>
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
                
                  
                  <MenuItem onClick={() => setOpen("history")}>
                    Show Edit History
                  </MenuItem>
                
              </Menu>
            </>
          }
        />
      </Card>
        <DialogContent  >
          
          <DialogContentText>
           The Complaint details are as follows:
          </DialogContentText>
          <MenuList>
                
                <MenuItem>
                <ListItemText >Category: {backendData.category}</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemText > 
                    Details: <Typography>{backendData.body}</Typography>
                  </ListItemText>
                </MenuItem>
                <MenuItem>
                <Card sx={{ p: 0, marginTop: 0, padding: 0}}>
                <Typography variant="body2"> Complaint lodged against: </Typography>

                  <CardHeader
                    avatar={
                      <Avatar src={userAgaisnt.photo} sx={{ width: 30, height: 30,backgroundColor: '#1976d2'}}>
                        
                      </Avatar>
                    }
                    title={
                      <>
                      <Typography variant="body1">
                    {userAgaisnt.name+" ("+userAgaisnt.nsuid+")"}
                    </Typography>
                      </>
                    }
                  />
                </Card>
                </MenuItem>
                <MenuItem>
                <Card sx={{ p: 0, marginTop: 0, padding: 0}}>
                <Typography variant="body2"> Selected Reviewer: </Typography>

                  <CardHeader
                    avatar={
                      <Avatar src={userReviewer.photo} sx={{ width: 30, height: 30,backgroundColor: '#1976d2'}}>
                        
                      </Avatar>
                    }
                    title={
                      <>
                      <Typography variant="body1">
                    {userReviewer.name+" ("+userReviewer.nsuid+")"}
                    </Typography>
                      </>
                    }
                  />
                </Card>                
                </MenuItem>
                <MenuItem>
                </MenuItem>
                <MenuItem>
                <Card sx={{ p: 0, marginTop: 0, padding: 0}}>
                <Typography variant="body2"> Evidence: </Typography>

                  <CardHeader
                    avatar={
                      <FilePresentIcon/>
                    }
                    title={
                      <>
                      <Typography variant="body1">
                      Attached Evidence
                    </Typography>
                      </>
                    }
                    onClick={() => openInNewTab(backendData.evidence)}
                  />
                </Card> 
                </MenuItem>
               
            </MenuList>
            <DialogActions>
         
         <Button onClick={() => setOpen(null)} variant="outlined">
           Cancel
         </Button>
         
       </DialogActions>
       {( backendData.length === 0) ? (
            <p> Wait </p>
          ) : (
            <>
              
              <CommentView fetchedData={backendData}/>
            </>
          )}
        </DialogContent>
        
        
        
        
        
      </Dialog>

      


      <Dialog open={ open === "history"}>
        
      <DialogTitle id="alert-dialog-title"><Avatar sx={{ bgcolor: blue[500] }}>
        <AssignmentIcon />
      </Avatar>
          {" The complaint edit versions are as follows: "}
        </DialogTitle>
        {/* <List sx={{ pt: 0 }}> */}
        {complaintVersions.map((data) => (
        
            <CompDetails fetchedData={data}/> 
         
        ))}

      
          <Button onClick={() => setOpen(null)} variant="outlined">
            Close
          </Button>
          
        {/* </DialogActions> */}
        
      </Dialog>
      
    </>
  );
}


