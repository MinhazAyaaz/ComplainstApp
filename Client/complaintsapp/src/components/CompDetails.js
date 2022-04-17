import React, {useEffect, useState } from "react";
import { DialogContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import MenuList from '@mui/material/MenuList';
import { MenuItem } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import DialogContentText from '@mui/material/DialogContentText';
function CompDetails(props ){
  const [backendData, setBackEndData] = React.useState([]);
  useEffect(()=>{

    console.log(props)
   
  }, [])
  return (
    <DialogContent>
      
    
        <ListItemText >Date edited: {props.fetchedData.date} </ListItemText>

        <ListItemText >Category: {props.fetchedData.category}</ListItemText>


        <ListItemText >
          Details: <Typography>{props.fetchedData.body}</Typography>
        </ListItemText>


        <ListItemText >Against: {props.fetchedData.against}</ListItemText>


        <ListItemText >Reviewer: {props.fetchedData.reviewer}</ListItemText>



     

    </DialogContent>
  )
}

export default CompDetails