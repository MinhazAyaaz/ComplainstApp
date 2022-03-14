import React, { useState } from "react";

import { Dialog } from "@mui/material";
import { DialogContent } from "@mui/material";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Input } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import EditForm from "./EditForm";


const Dialog2 = ({ open, close }) => {
  const [selectedValue, setSelectedValue] = useState("");
  
  
  return (
    <Dialog
      style={{ zIndex: 1800 }}
      open={open}
      keepMounted
      onClose={close}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <div>
        <DialogContent >
           
            <EditForm/>
       
         
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default Dialog2;
