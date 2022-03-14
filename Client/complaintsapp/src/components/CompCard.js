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
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import { MenuItem } from '@mui/material';
import { Dialog } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import ListItemText from '@mui/material/ListItemText';
import { Input } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Dialog1 from './Dialog1';

import { Alert } from '@mui/material';


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

 

 
 
  console.log(fetchedData)
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
            R
          </Avatar>
        }

        title={

          <Typography gutterBottom variant="h5" component="div">
          {backendData.title}
        </Typography>
        }


        subheader={fetchedData.fetchedData.creationdate}

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
        <div>
        <Dialog1 open={openDlg1Dialog} close={() => setDialog1Open(false)} />
      </div>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          setDialog1Open(true);
        }}
      >
        Show More
      </Button>



           </CardActions>

    </Card>
  );
}

