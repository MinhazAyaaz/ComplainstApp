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
      {'Not really by NSU // '}
      <Link color="inherit" href="/">
        NSU Complaints
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



export default function Login() {
  
  const [role, setRole] = React.useState('');
  const [nsuidError, setNsuidError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [accountError, setAccountError] = React.useState(false);
  const [nsuidErrorMessage, setNsuidErrorMessage] = React.useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [accountErrorMessage, setAccountErrorMessage] = React.useState('');

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
      sessionStorage.setItem("role", response.data.role)
      console.log(sessionStorage.getItem("jwtkey"))
      window.location.href = '/dashboard';
    })
    .catch(function (error) {
      console.log(error);
      let errorCode = error.response.status;

      if(errorCode == 601){
        setNsuidError(true)
        setNsuidErrorMessage('Incorrect NSU ID')
      }
      else{
        setNsuidError(false)
        setNsuidErrorMessage('')
      }
      if(errorCode == 404){
        setAccountError(true)
        setAccountErrorMessage('Account not found')
      }
      else{
        setAccountError(false)
        setAccountErrorMessage('')
      }
      if(errorCode == 401){
        setPasswordError(true)
        setPasswordErrorMessage('Incorrect password')
      }
      else{
        setPasswordError(false)
        setPasswordErrorMessage('')
      }

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
            NSU Complaints Forum
          </Typography>

          

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            
            <TextField
              margin="normal"
              error={nsuidError || accountError}
              helperText={nsuidErrorMessage}
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
                error={passwordError || accountError}
                helperText={passwordErrorMessage}
                required
                fullWidth
                autoComplete="current-password"
                autoFocus
                id="outlined-password-input"
                label="Password"
                type="password"
                name="password"
            />

{(accountError ? (<Typography align="center" color="red"><br/>{accountErrorMessage}</Typography>):(null))}
            
            
            

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In 
            </Button>

            <Grid container>

              <Grid item xs={12}>
                <Link href="/signup" variant="body2">
                  <Typography align="center">
                    {"Don't have an account? Sign Up"}
                  </Typography>
                </Link>
              </Grid>
            </Grid>

            <Typography sx={{ maxWidth: 900,  p: 3,
                color: '#888',
                margin: 'auto',
                borderBottom: 'solid',
                borderColor: '#888',
                padding: 1,
                paddingTop: 2,
                marginBottom: 2,
                maxWidth: 1000,
                flexGrow: 1,
              }}
              align="center" /> 
            
              <GoogleLogin
              clientId={'689285763404-9ih3lrpb9154mhob4rs8oqbpruvng95s.apps.googleusercontent.com'}
              buttonText="Log in with Google"
              onSuccess={handleGLogin}
              onFailure={handleGFailure}
              hostedDomain="northsouth.edu"
              cookiePolicy={'single_host_origin'}
              className="GoogleButton"
              >
                or continue with Google
              </GoogleLogin>

          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
