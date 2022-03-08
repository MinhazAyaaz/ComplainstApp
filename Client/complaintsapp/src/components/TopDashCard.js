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

import PrimarySearchAppBar from '../components/navbar';
import NavBar from '../components/complaintEditor'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';

import CommentIcon from '@mui/icons-material/Comment';
import { Badge } from '@mui/material';

import AddBoxIcon from '@mui/icons-material/AddBox';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function TopDashCard() {


  const createcomplaint = () => {

  };

  return (
    <Paper
    sx={{
      p: 3,
      margin: 'auto',
      marginTop: 5,
      maxWidth: 1000,
      maxHeight: 800,
      flexGrow: 1,
      backgroundColor: (theme) =>
        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    }}
  >
    <Grid container spacing={2}>

      <Grid item xs={12} sm container>
        <Grid item xs container direction="column" spacing={1}>
          <Grid item xs>

            <Typography variant="subtitle1"  textAlign={'left'}>
              Create a new complaint....
            </Typography>

          </Grid>

        </Grid>
        <Grid item>
        <AddBoxIcon onClick={createcomplaint} sx={{ color: '#1976d2',  width: 35, height: 35}} />

        </Grid>

      </Grid>
    </Grid>
  </Paper>






  );
}
