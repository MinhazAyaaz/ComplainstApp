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

import DialogContentText from '@mui/material/DialogContentText';

import Comment from "./Comment";

import ListItemText from '@mui/material/ListItemText';
import EditForm from "./EditForm";

export default function CompCardExpanded( fetchedData ) {
  
  const [open, setOpen] = useState();
  const [backendData, setBackEndData] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  
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
      creationdate: fetchedData.data.creationdate,
      status: fetchedData.data.status,
      title: fetchedData.data.title,
      against: fetchedData.data.against,
      category: fetchedData.data.category,
      body: fetchedData.data.body,
      reviewer: fetchedData.data.reviewer,

    })
   
 }, [])

  return (
    <>
      <Button onClick={() => setOpen("first")}variant="outlined"s>
        Show More
      </Button>

      <Dialog open={open && open === "first"} fullWidth="true" maxWidth="lg">
      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ width: 45, height: 45,backgroundColor: '#1976d2'}}>
              X
            </Avatar>
          }
          title={
            <Typography gutterBottom variant="h5" component="div">
            {backendData.title}
          </Typography>
          }
          subheader={backendData.creationdate}
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
                  <MenuItem onClick={handleClose}>
                    Delete Complaint
                  </MenuItem>
                
              </Menu>
            </>
          }
        />
      </Card>
        <DialogContent >
          
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
           
               
            </MenuList>

        </DialogContent>
        
        <DialogActions>
         
          <Button onClick={() => setOpen(null)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={() => setOpen("second")} variant="outlined">
            Edit Form
          </Button>
        </DialogActions>
        
        <Comment fetchedData={backendData}/>
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
      
    </>
  );
}


