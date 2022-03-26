import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import GoogleLogin from 'react-google-login';
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

const handleGFailure = (result) => {
  alert(result);
  
};

const handleGLogin = async (googleData) => {
  console.log(googleData);

  axios.post('/Gsignup', {
    token: googleData.tokenId,
    // nsuid: googleData.profileObj.familyName,
    // email: googleData.profileObj.email,
    // password: googleData.profileObj.googleId,
  })
  .then(function (response) {
    console.log(response);
    console.log(response);
      sessionStorage.setItem("jwtkey", response.data.accessToken)
      console.log(sessionStorage.getItem("jwtkey"))
      window.location.href = '/dashboard';
  })
  .catch(function (error) {
    console.log(error);
  });
  //local storage
  // const data = await res.json();
  // setLoginData(data);
  // localStorage.setItem('loginData', JSON.stringify(data));
};



export default function SignIn() {
  
  const [role, setRole] = React.useState('');

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      nsuid: data.get('nsuid'),
      password: data.get('password'),
    });
    
    axios.post('/login', {
      nsuid: data.get('nsuid'),
      password: data.get('password'),
    })
    .then(function (response) {
      console.log(response);
      sessionStorage.setItem("jwtkey", response.data.accessToken)
      console.log(sessionStorage.getItem("jwtkey"))
      // window.location.href = '/dashboard';
    })
    .catch(function (error) {
      console.log(error);

    });

    // axios.post('/login', {
    //   params: {
    //     nsuid: data.get('nsuid'),
    //     password: data.get('password'),
    //   }
    // })
    // .then(function (response) {
    //   console.log(response.data);
    // })
    // .catch(function (error) {
    //   console.log(error);
    // })
    // .then(function () {
    //   // always executed
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
          <Avatar sx={{ m: 1, backgroundColor: '#1976d2' }}>
            <LockIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Log In
          </Typography>

          

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            
            <TextField
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


            <GoogleLogin
              clientId={'689285763404-9ih3lrpb9154mhob4rs8oqbpruvng95s.apps.googleusercontent.com'}
              buttonText="Log in with Google"
              onSuccess={handleGLogin}
              onFailure={handleGFailure}
              hostedDomain="northsouth.edu"
              cookiePolicy={'single_host_origin'}
            ></GoogleLogin>

            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In 
            </Button>

            <Grid container>

              <Grid item>
                <Link href="/" variant="body2">
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
