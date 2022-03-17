import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Dialog } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { DialogContent } from "@mui/material";

import MenuList from '@mui/material/MenuList';
import { MenuItem } from '@mui/material';
 
import DialogContentText from '@mui/material/DialogContentText';


import ListItemText from '@mui/material/ListItemText';
import EditForm from "./EditForm";

export default function Dialogs( fetchedData ) {
  
  const [open, setOpen] = useState();
  const [backendData, setBackEndData] = React.useState([]);

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

      <Dialog open={open && open === "first"}>
      
        <DialogContent>
          
          <DialogContentText>
           The Complaint details are as follows:
          </DialogContentText>
          <MenuList dense>
                <MenuItem>
                <ListItemText >
          Title: {backendData.title}</ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText >Category: {backendData.category}</ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText >Description: {backendData.body}</ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText >Date of Creation: {backendData.creationdate}</ListItemText>
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
        
      </Dialog>

      <Dialog open={open && open === "second"}>
        
        <DialogContent>
        <Typography  variant="body1">Edit Previous Complaint</Typography>
          <EditForm data={backendData}/>
        </DialogContent>
        <DialogActions>
        <Button  variant="outlined" type="submit" >
        Submit
      </Button>
          <Button onClick={() => setOpen(null)} variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}


