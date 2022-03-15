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

export default function Dialogs() {
  const [open, setOpen] = useState();

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
          Title: Parinda Rahman</ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText >Category: 1931804042</ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText >Description: xyz@gmail.com</ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText >Date of Creation: 1931804042</ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText >Against: Emon</ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText >Reviewer: xyz@gmail.com</ListItemText>
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
          <EditForm/>
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


