import React from "react";
import Dialog2 from "./Dialog2";
import { Dialog } from "@mui/material";
import { Button } from "@mui/material";
import { DialogContent } from "@mui/material";
import MenuList from '@mui/material/MenuList';
import { MenuItem } from '@mui/material';

import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import ListItemText from '@mui/material/ListItemText';
import CreateComplaintCard from "./CompCard";



const Dialog1 = ({ open, close }) => {
  
  const [openDlg2Dialog, setDialog2Open] = React.useState(false);
  
 
  return (
    <div>
      <Dialog2 open={openDlg2Dialog} close={() => setDialog2Open(false)} />
      
      
    
      <Dialog
        style={{ zIndex: 1700 }}
        open={open}
        keepMounted
        onClose={close}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <div>
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
            <Button  variant="outlined"
              color="primary" 
              sx={{ m: 2 }}
              onClick={() => {
                setDialog2Open(false);
              }}
             
              >Close</Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setDialog2Open(true);
              }}
            >
              Edit Complaint
            </Button>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default Dialog1;