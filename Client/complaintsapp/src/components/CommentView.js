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
import { Box } from '@mui/system';
import axios from 'axios';
import Comment from './Comment';
import MessageIcon from '@mui/icons-material/Message';

export default function CommentView( fetchedData ) {

  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [backendData, setBackEndData] = React.useState([]);
  const [openDlg1Dialog, setDialog1Open] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [comments, setComments] = React.useState([]);

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
       createdby: fetchedData.fetchedData.createdby,
     })
     fetchComments()
    
  }, [])

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  async function fetchComments (){
    //API Endpoint '/findAll' is for testing only
    //
    console.log(fetchedData.fetchedData.complaintid)
      await axios.get('/fetchComment', {
      headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        complaintid: fetchedData.fetchedData.complaintid
      }
    })
    .then(function (response) {
      setComments(response.data)
      console.log(comments)
      console.log(response.data)
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
      
    });
  };

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
    <Card sx={{   p: 3,
          
          marginTop: 1,
          padding: 1,
          
        
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff'}}>

          <CardHeader
            avatar={
              <Avatar sx={{ width: 45, height: 45, float: 'left', backgroundColor: '#1976d2'}}>
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
            <Button onClick={handleSubmit} variant="outlined" sx={{marginTop: 2, float: 'right', }}>
                Post
              </Button></>
            }
            
            
          />
          
          

        </Card>
    {(comments.length === 0) ?
    (<p>No comment</p>)
    :
    (
      <Box >
        <Typography>
          Comments <MessageIcon fontS ize="small"/>({comments.length})
        </Typography>
      {comments.map((data, index) =>(
        <>
    
      <Card sx={{   p: 3,
        
        marginTop: 0,
        padding: 1,
        
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff'}}>

        <CardHeader
          avatar={
            <Avatar sx={{ width: 45, height: 45,backgroundColor: '#1976d2'}}>
              X
            </Avatar>
          }
          title={
            <>
            <Typography variant="body2" color="text.secondary">
          {data.user}
          </Typography>
            </>
          }
          subheader={
            <>
              <Typography variant="body" type="h1" color="text.primary">
          {data.comment}
          </Typography>
            </>
          }
          
          
        />
        
        

      </Card>
    </>
      ))}

          
      </Box>
    )
    }
    </>
  );
  
}

