import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Input } from '@mui/material';
import GoogleLoginComponent from '../components/GoogleLoginComponent';

import axios from 'axios';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const theme = createTheme();



export default function SignUp() {
  
  const [role, setRole] = React.useState('');
  const [roleError, setRoleError] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);
  const [nsuidError, setNsuidError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [incompleteError, setIncompleteError] = React.useState(false);
  const [nsuidErrorMessage, setNsuidErrorMessage] = React.useState("");

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      role: role,
      name: data.get('name'),
      nsuid: data.get('nsuid'),
      email: data.get('email'),
      password: data.get('password'),
    });
    
    axios.post('/signup', {
      role: role,
      name: data.get('name'),
      nsuid: data.get('nsuid'),
      email: data.get('email'),
      password: data.get('password'),
    })
    .then(function (response) {
      console.log(response);
      setRoleError(false);
      setPasswordError(false);
      setEmailError(false);
      setNsuidError(false);
      setNameError(false);
      setIncompleteError(false)
      window.location.href = '/login';

    })
    .catch(function (error) {
      console.log(error.response.status);
      console.log(error.response.data);
      let errorCode = error.response.status;

      //Manages state of error messages
      //For each 
      if(errorCode == 410)
        setRoleError(true)
      else
        setRoleError(false)
      
      if(errorCode == 411)
        setNameError(true)
      else
        setNameError(false)
      
      if(errorCode == 412)
        setNsuidError(true)
      else
        setNsuidError(false)
      
      if(errorCode == 413)
        setEmailError(true)
      else
        setEmailError(false)
      
      if(errorCode == 414)
        setPasswordError(true)
      else
        setPasswordError(false)
      
      if(errorCode == 601) {
        setNsuidError(true)
        setNsuidErrorMessage(error.response.data)
      }
      else
        setNsuidError(false)

      if(errorCode > 400 && errorCode < 500)
        setIncompleteError(true)
      else
        setIncompleteError(false)
      
        
    });

    // axios({
    //   method: 'post',
    //   url: '/signup',
    //   data: {
    //     name: data.get('name'),
    //     password: data.get('password'),
    //   }
    // })
    // .then(function (response) {
    //   console.log(response);
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });

  };



  return (

    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 3, backgroundColor: '#1976d2' }}>
            <LockIcon /> 
          </Avatar>

          <Typography component="h1" variant="h5">
            NSU COMPLAINTS // SIGN UP 
          </Typography>
          <br/>
          <FormControl fullWidth error={roleError}>
          <InputLabel id="demo-simple-select-label">Role*</InputLabel>
              <Select
                error={roleError}
                helperText="shit"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={role}
                label="role"
                onChange={handleChange}
              >
                <MenuItem value={'student'}>Student</MenuItem>
                <MenuItem value={'faculty'}>Faculty</MenuItem>
                <MenuItem value={'adminEmployee'}>Admin Employee</MenuItem>
                <MenuItem value={'staff'}>Helping Staff</MenuItem>
                <MenuItem value={'admin'}>System Admin</MenuItem>
              </Select>
              
                
              
          </FormControl>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              error={nameError}
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              error={nsuidError}
              helperText={nsuidErrorMessage}
              margin="normal"
              required
              fullWidth
              id="nsuid"
              label="NSU ID"
              name="nsuid"
              autoComplete="NSUID"
              autoFocus
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />

            <TextField
              error={emailError}
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              id="email"
              autoComplete="email"
            />
             <TextField
                error={passwordError}
                margin="normal"
                required
                fullWidth
                autoComplete="current-password"
                autoFocus
                id="outlined-password-input"
                label="Password"
                type="password"
           
                name="password"
            />

            <label htmlFor="icon-button-file">
            <InputLabel id="demo-simple-select-label">Scan of NSU ID</InputLabel>

            <Input accept="image/*"  id="icon-button-file" type="file"
            />
            <AttachFileIcon/>


            </label>





            <GoogleLoginComponent />
            {(incompleteError ? (<Typography align="center" color="red"><br/>Required fields cannot be empty.</Typography>):(null))}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, }}
            >
              Continue
            </Button>

            <Grid container>

              <Grid item>
                <Link href="/signin" variant="body2">
                  {"Have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
