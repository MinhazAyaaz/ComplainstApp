import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import { MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { Input } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Collapse } from '@mui/material';
import { Alert } from '@mui/material';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';




const theme = createTheme();

export default function CreateComplaint() {
  const [age, setAge] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    setAge(event.target.value);
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console

  };

  return (
    <ThemeProvider theme={theme}>
        <Typography component="h1" variant="h3"  sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color:'#1976d2'
              }}>
              Create A Complaint
            </Typography>

        <Grid item sm={4} md={12} >
          <Box
            sx={{
                my: 8,
                mx: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
          >


            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="against"
              label="Who is it against?"
              type="against"
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


              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 5, mb: 2 }}
                onClick={() => {
                  setOpen(true);
                }}

              >
                Submit
              </Button>
              <Box sx={{ width: '100%' }}>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton

              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >

            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Success!
        </Alert>
      </Collapse>

    </Box>


            </Box>
          </Box>


        </Grid>



    </ThemeProvider>
  );
}
