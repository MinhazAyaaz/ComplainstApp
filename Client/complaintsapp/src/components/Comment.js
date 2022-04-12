import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Badge } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import { MenuItem } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import Menu from '@mui/material/Menu';
import { TextField } from '@mui/material';
import Dialogs from './Dialogs';
import CompCardExpanded from './CompCardExpanded';
import { Button } from '@mui/material';
import { Alert } from '@mui/material';

import axios from 'axios';


export default function Comment( ) {

  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [backendData, setBackEndData] = React.useState([]);
  const [openDlg1Dialog, setDialog1Open] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  React.useEffect(()=>{

     
     
    
  }, [])

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  console.log(backendData.complaintid)
  const handleSubmit = () => {
    
    // eslint-disable-next-line no-console

    console.log({
      comment: value,
      complaintid: backendData.complaintid,
    });
    
    axios.post('/createComment', {
      comment: value,
      complaintid: backendData.complaintid,
    }, {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
    }
    )
    .then(function (response) {
      console.log(response);
      
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });
    
  };


  return (
    <>
    
    <Card sx={{ maxWidth: 900,  p: 3,
      
      marginTop: 1,
      padding: 1,
      maxWidth: 1000,
    
      backgroundColor: (theme) =>
        theme.palette.mode === 'dark' ? '#1A2027' : '#fff'}}>

      <CardHeader
        avatar={
          <Avatar sx={{ width: 45, height: 45, backgroundColor: '#1976d2'}}>
            X
          </Avatar>
        }
        title={
          <>
          <TextField
          id="outlined-multiline-flexible"
          label="Multiline"
          multiline
          maxRows={4}
          value={value}
          onChange={handleChange}
          sx={{width: '100%'}}
        />
        <Button onClick={handleSubmit} variant="outlined" sx={{margin: 2,marginLeft: '89%', }}>
            Post
          </Button></>
        }
        
        
      />
      
      

    </Card>
    </>
  );
  
}

