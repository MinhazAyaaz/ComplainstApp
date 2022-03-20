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

import Dialogs from './Dialogs';

import { Alert } from '@mui/material';

import axios from 'axios';


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(0deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


export default function CreateComplaintCard( fetchedData ) {

  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [age, setAge] = React.useState('');
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

     setBackEndData({

       complaintid: fetchedData.fetchedData.complaintid,
       creationdate: fetchedData.fetchedData.creationdate,
       status: fetchedData.fetchedData.status,
       title: fetchedData.fetchedData.title,
       against: fetchedData.fetchedData.against,
       category: fetchedData.fetchedData.category,
       body: fetchedData.fetchedData.body,
       reviewer: fetchedData.fetchedData.reviewer,

     })
     
    
  }, [])

  

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDelete = () => {
    
    
    axios.post('/deletecomplaint', {
      id: backendData.complaintid
    })
    .then(function (response) {
      console.log(response);
      window.location.reload()
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });
    
  };


  return (
    <Card sx={{ maxWidth: 900,  p: 3,
      margin: 'auto',
      marginTop: 5,
      maxWidth: 1000,
      flexGrow: 1,
      backgroundColor: (theme) =>
        theme.palette.mode === 'dark' ? '#1A2027' : '#fff'}}>

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
        subheader={fetchedData.fetchedData.creationdate}
        action={
          <>
              
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
                  <MenuItem onClick={handleDelete}>
                    Delete Complaint
                  </MenuItem>
                
              </Menu>
            </>
        }
      />
      
      <CardContent>
        <Typography variant="body2" color="text.secondary">
        {backendData.body}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
      <IconButton
        size="large"
        aria-label="show 17 new notifications"
      >

        <Badge badgeContent={17} color="error" size="small" sx={{ marginRight:4}} >
          <CommentIcon sx={{ color:'#1976d2',marginRight:1}}
        />

              </Badge>
              <Badge badgeContent={17} color="error" >
                <EditIcon sx={{ color:'#1976d2',marginRight:1 }}
                 />

              </Badge>
            </IconButton>
            <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
      
        </ExpandMore>

        {( backendData.length === 0) ? (
        <p> Wait </p>
      ) : (
          <Dialogs data={backendData} />
      )}

        



           </CardActions>

    </Card>
  );
}

