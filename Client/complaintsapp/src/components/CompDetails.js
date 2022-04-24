import React, {useEffect, useState } from "react";
import { DialogContent, ListItem } from "@mui/material";
import Typography from "@mui/material/Typography";
import MenuList from '@mui/material/MenuList';
import { MenuItem } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DialogContentText from '@mui/material/DialogContentText';
// import ListItem from '@mui/material/ListItem';
import Moment from 'react-moment';
import List from '@mui/material/List';
import { Card, CardHeader } from "@mui/material";
import FilePresentIcon from '@mui/icons-material/FilePresent';


function CompDetails(props ){
  const [isInitial, setInitial] = React.useState(false);
  const [backendData, setBackendData] = useState({})
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  return (
    <List sx={{ width: '100%', maxWidth: 460, bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        <ListItemText
          primary="Date and timestamp:"
          secondary={
            <React.Fragment>
             
                <Moment date={props.fetchedData.createdAt} format="D MMM YYYY HH:mm"/>
                
                <ListItemText > Title: {props.fetchedData.title}  </ListItemText>
                
                <ListItemText > Category: {props.fetchedData.category}</ListItemText>


    <ListItemText > Details: {props.fetchedData.body}  </ListItemText>


     <ListItemText >Against: {props.fetchedData.against} </ListItemText>


  <ListItemText >Reviewer: {props.fetchedData.reviewer} </ListItemText> 
            <ListItemText > <Card sx={{ p: 0, marginTop: 0, padding: 0}}>

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
                    onClick={() => openInNewTab(props.fetchedData.evidence)}
                  />
                </Card> </ListItemText> 
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
     
      
     
    </List>
 
  )
}

export default CompDetails