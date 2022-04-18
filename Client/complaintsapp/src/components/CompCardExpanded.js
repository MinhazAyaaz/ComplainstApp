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
            <Avatar src={user.idscan} sx={{ width: 45, height: 45,backgroundColor: '#1976d2'}}>
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
                
                  <MenuItem onClick={handleClose}>
                    Edit Complaint
                  </MenuItem>
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
                <ListItemText >Against: {backendData.against}</ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText >Reviewer: {backendData.reviewer}</ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText >Evidence: <Button onClick={() => openInNewTab(backendData.evidence)}>Click here</Button></ListItemText>
                </MenuItem>
           
               
            </MenuList>
            <DialogActions>
         
         <Button onClick={() => setOpen(null)} variant="outlined">
           Cancel
         </Button>
         <Button onClick={() => setOpen("second")} variant="outlined">
         <EditIcon sx={{ color:'#1976d2',marginRight:1 }}
                 />Edit Form
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

      <Dialog open={open && open === "second"}>
        
        <DialogContent>
        <Typography  variant="body1">Edit Previous Complaint</Typography>
          
          {( backendData.length === 0) ? (
            <p> Wait </p>
          ) : (
            <EditForm data={backendData}/>
          )}
          
        </DialogContent>
        <DialogActions>
        <Button  variant="outlined" type="submit" >
        Submit
      </Button>
          <Button onClick={() => setOpen(null)} variant="outlined">
            Close
          </Button>
          
        </DialogActions>
        
      </Dialog>


      <Dialog open={ open === "history"}>
        
      
        <DialogActions>
        <DialogContentText>
           The complaint edit history are as follows:
          </DialogContentText>
            {complaintVersions.map((data, i) => 
          <CompDetails fetchedData={data}/>
        )} 
         {/* <CompDetails fetchedData = {complaintVersions} i={0}></CompDetails>  */}

         
         {/* <CompDetails
          complaintVersion= {fetchedData.data.complaintid}
      creationdate={ fetchedData.data.creationdate}
      status={ fetchedData.data.status}
      title={ fetchedData.data.title}
      against={ fetchedData.data.against}
      category={ fetchedData.data.category}
      body={ fetchedData.data.body}
      reviewer={ fetchedData.data.reviewer}></CompDetails>  */}

          <Button onClick={() => setOpen(null)} variant="outlined">
            Close
          </Button>
          
        </DialogActions>
        
      </Dialog>
      
    </>
  );
}


