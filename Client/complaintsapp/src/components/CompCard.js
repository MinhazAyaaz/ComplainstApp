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
import { MenuItem } from '@mui/material';
import { Dialog } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import { Input } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';

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


export default function CreateComplaintCard() {

  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [age, setAge] = React.useState('');


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const edit = () => {
    
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console

  };
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
            R
          </Avatar>
        }

        title={

          <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        }


        subheader="September 14, 2016"

      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
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
           <Button  variant="outlined" onClick={handleClickOpen}>
        Show More
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Complaint Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
           The Complaint details are as follows:
          </DialogContentText>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="against"
              label="Who is it against?"
              type="string"
              id="against"
              autoComplete="against"
            />
            <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Category*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={10}>Bullying</MenuItem>
                <MenuItem value={20}>xyz</MenuItem>
                <MenuItem value={30}>xyz</MenuItem>
                <MenuItem value={40}>xyz</MenuItem>
                <MenuItem value={50}>xyz</MenuItem>
              </Select>
          </FormControl>
          <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="title"
                name="email"
                autoComplete="title"
                autoFocus
              />
          <TextField
                margin="normal"
                required
                fullWidth
                name="Body"
                label="Body"
                type="Body"
                id="Body"
                autoComplete="Body"
              />
               <TextField
              margin="normal"
              required
              fullWidth
              name="against"
              label="Who will review it?"
              type="review"
              id="review"
              autoComplete="review"
            />
            <Input accept="image/*" label="Evidence" id="icon-button-file" type="file"
            />
            <AttachFileIcon/>




          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={edit}>Edit Complaint</Button>
        </DialogActions>
      </Dialog>

        </ExpandMore>


           </CardActions>

    </Card>
  );
}
