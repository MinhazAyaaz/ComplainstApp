import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { MenuItem } from '@mui/material';
import { Dialog } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { Input } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import PrimarySearchAppBar from '../components/navbar';
import NavBar from '../components/complaintEditor'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';

import CommentIcon from '@mui/icons-material/Comment';
import { Badge } from '@mui/material';

import AddBoxIcon from '@mui/icons-material/AddBox';

import axios from 'axios';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function TopDashCard() {

  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [age, setAge] = React.useState('');

  

  const createcomplaint = () => {

  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const expandForm = () =>{
    setExpanded(true);
  };
  const unExpandForm = () =>{
    setExpanded(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console

    console.log({
      title: data.get('title'),
      against: data.get('against'),
      category: age,
      body: data.get('body'),
      reviewer: data.get('reviewer'),
    });
    
    axios.post('/createcomplaint', {
      title: data.get('title'),
      against: data.get('against'),
      category: age,
      body: data.get('body'),
      reviewer: data.get('reviewer'),
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

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
    

      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        
        <TextField
          multiline={true}
          margin="normal"
          required
          fullWidth
          id="title"
          label="Write a complaint"
          name="title"
          autoComplete="title"
          autoFocus
          variant="standard"
          size="medium"
          onClick={expandForm}
        />

        {expanded ? 
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
        :null}

        {expanded ? 
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Category*</InputLabel>
            <Select
              labelId="category"
              id="category"
              value={age}
              label="category"
              onChange={handleChange}
            >
              <MenuItem value={"bullying"}>Bullying</MenuItem>
              <MenuItem value={"sanitation"}>Sanitation</MenuItem>
              
            </Select>
        </FormControl>
        :null}
          
        {expanded ?
        <TextField
          multiline={true}
          margin="normal"
          required
          fullWidth
          name="body"
          label="body"
          type="body"
          id="body"
          autoComplete="Body"
          rows={5}
        />
        :null}

        {expanded ?
        <TextField
          margin="normal"
          required
          fullWidth
          name="reviewer"
          label="Who will review it?"
          type="reviewer"
          id="reviewer"
          autoComplete="reviewer"
        />
        :null}

        {expanded ?
        <div>
        <Input accept="image/*" label="Evidence" id="icon-button-file" type="file"/>
        <AttachFileIcon/>
        </div>
        :null}
        
        {expanded ?
      <Box sx={{display: "flex",
      justifyContent: "flex-end",
                alignItems: "flex-end"}}
                >
    <Button  variant="filled" onClick={unExpandForm} >
        Cancel
      </Button>
      <Button  variant="outlined" type="submit" >
        Submit
      </Button>
      </Box>
      :null}
        
      </Box>
      
      
    
  </Card>

    





  );
}
