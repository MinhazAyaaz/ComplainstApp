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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Input } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { createWorker } from "tesseract.js";

import { useFormik } from 'formik';
import * as yup from 'yup';

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

export default function SignUpOcr() {
  
  const [role, setRole] = React.useState('');
  const [role2, setRole2] = React.useState('');
  const [roleError, setRoleError] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);
  const [nsuidError, setNsuidError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [incompleteError, setIncompleteError] = React.useState(false);
  const [nsuidErrorMessage, setNsuidErrorMessage] = React.useState("");
  const [emailMessage, setEmailMessage] = React.useState(false)
  const [email, setEmail] = React.useState()

  //OCR hooks
  const [ocr, setOcr] = React.useState("");
  const [ocr2, setOcr2] = React.useState("");
  const [imageData, setImageData] = React.useState(null);
  const [progress, setProgress] = React.useState(0);

  //check if login data is available locally
  const [loginData, setLoginData] = React.useState(
    localStorage.getItem('loginData')
      ? JSON.parse(localStorage.getItem('loginData'))
      : null
  );


  //OCR methods
  const worker = createWorker({
    logger: (m) => {
      console.log(m);
      setProgress(parseInt(m.progress*100))
    },
  });
  const convertImageToText = async () => {
    if (!imageData) return;
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(imageData);

    var text2 = text
    text2 = text2.split('\n')

    console.log(text2)

    var finalString = ""
    var tempString
  
    for(var i=0; i<text2.length;i++){
        if(text2[i].length >= 10){
            tempString = text2[i]
            tempString = Array.from(tempString)
            console.log(tempString)
            for(var j=0; j<tempString.length; j++){
                if(tempString[j]>='0' && tempString[j]<='9'){
                    finalString = finalString + tempString[j]
                    console.log(tempString[j])
                }
            }
        }
        if(finalString.length == 10){
            break
        }else{
            finalString=""
        }
    }
    setOcr(finalString);
    setOcr2(text)
  };
  
  React.useEffect(() => {
    convertImageToText();
  }, [imageData]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if(!file)return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUri = reader.result;
      console.log({ imageDataUri });
      setImageData(imageDataUri);
    };
    reader.readAsDataURL(file);
  }


    const validationSchema = yup.object({
    role: yup
    .string('Enter your role at North South University')
    .required('Role is required'),
    name: yup
      .string('Enter your name')
      .required('Name is required'),
    nsuid: yup
      .string('Enter your NSU ID')
      .length(10, 'NSU ID should be of 10 characters length')
      .required('NSU ID  is required'),
      email: yup
      .string('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
      password: yup
      .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  
  });
  
  
    const formik = useFormik({
  
      initialValues: {
        // email: 'foobar@example.com',
        // password: 'foobar',
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        alert(JSON.stringify(values, null, 2));
      },
    });


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
    })
    .catch(function (error) {
      console.log(error);
    });
    //local storage
    // const data = await res.json();
    // setLoginData(data);
    // localStorage.setItem('loginData', JSON.stringify(data));
  };

  const handleGLogout = () => {
    localStorage.removeItem('loginData');
    setLoginData(null);
  };

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = (event) => {
    formik.handleSubmit();
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console

    
    if(role == "1" || role == "2" || role == "3" )
      setRole("user")

    console.log({
      roles: role,
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
      // window.location.href = '/login';
      setEmail(data.get('email'))
      setEmailMessage(true)
    })
    .catch(function (error) {
      console.log(error);
      let errorCode = error.response.status;

      //Manages state of error messages
      //For each 
      if(errorCode == 410)
        setRoleError(true)
      else
        setRoleError(false)
      
      if(errorCode == 419)
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
      
      if(errorCode == 560)
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

    axios.post('/signup/idupload',{
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params:{
        "nsuid": data.get('nsuid')
      }
    })
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
    <Grid container spacing={2}>


        <Grid item xs={6}>
        <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >
            <div>
                <p>Choose an Image</p>
                <input
                type="file"
                name=""
                id=""
                onChange={handleImageChange}
                accept="image/*"
                />
            </div>
            {progress < 100 && progress > 0 && <div>
                <div className="progress-label">Progress ({progress}%)</div>
                <div className="progress-bar">
                <div className="progress" style={{width: `${progress}%`}} ></div>
                </div>
            </div>}
            <div className="display-flex">
                <img src={imageData} alt="" srcset="" className="ocrimg" />
                <p>{ocr}</p>
                <p>{ocr2}</p>
            </div>
            </Box>
        </Grid>


        <Grid item xs={6}>
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
                    <AccountCircleIcon sx={{width: 40, height: 40}} /> 
                </Avatar>

                <Typography component="h1" variant="h5">
                    NSU COMPLAINTS // SIGN UP 
                </Typography>
                <br/>
                {(emailMessage ? (<Typography align="center" color="black"><br/>An email has been sent to {email} please click on the link to activate your account. </Typography>):(null))}

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
                        <MenuItem value={'1'}>Student</MenuItem>
                        <MenuItem value={'2'}>Faculty</MenuItem>
                        <MenuItem value={'3'}>Admin Employee</MenuItem>
                        <MenuItem value={'4'}>Helping Staff</MenuItem>
                    </Select>
                    
                        
                    
                </FormControl>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                    
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    autoFocus

                    onChange={formik.handleChange}
                    error={ formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    />
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
                    onChange={formik.handleChange}
                    error={ formik.touched.nsuid && Boolean(formik.errors.nsuid)}
                    helperText={formik.touched.nsuid && formik.errors.nsuid}
                    />

                    

                    {(role == "4") ?

                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="email"
                    label="Email Address"
                    type="email"
                    id="email"
                    
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={ formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    />

                    : 
                    
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="email"
                    label="Email Address"
                    
                    id="email"
                    InputProps={{
                        endAdornment: <InputAdornment position="end">@northsouth.edu</InputAdornment>,
                    }}
                    type="text" pattern="[a-zA-Z0-9-]"
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={ formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    />
                    
                    
                    }
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
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={ formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />


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

                    <Grid item xs={12}>
                        <Link href="/login" variant="body2">
                        <Typography align="center">
                            {"Have an account? Log In"}
                        </Typography>
                        </Link>
                    </Grid>
                    </Grid>
                </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
      </Grid>


      </Grid>
    </ThemeProvider>
  );
}
