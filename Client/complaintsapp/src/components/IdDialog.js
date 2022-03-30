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


import ListItemText from '@mui/material/ListItemText';
import EditForm from "./EditForm";

export default function IdDialogs( fetchedData ) {
  
  const [open, setOpen] = useState(false);
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
    setOpen(fetchedData.data.complaintid)
    
   
 }, [])

  return (
    <>
      

      <Dialog open={open} fullWidth="true" maxWidth="lg">
    
        <DialogContent>


        </DialogContent>
          
      </Dialog>
    </>
  );
}


