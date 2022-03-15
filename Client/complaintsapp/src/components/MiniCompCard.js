import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import LockIcon from '@mui/icons-material/Lock';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Check from '@mui/icons-material/Check';

export default function MiniCompCard() {
  
 
  
  return (
    <React.Fragment>
    
      <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
            
         
            
                <Paper sx={{ width: 550 }}>
            <MenuList dense>
                <MenuItem>
                <ListItemText inset>
          Title: Emon bullied me </ListItemText>
                </MenuItem>
                <MenuItem>
                <ListItemText inset>Date: Today</ListItemText>
                </MenuItem>
                
            
                
            </MenuList>
            </Paper>
            
            
        </Box>


     
    
    </React.Fragment>
  );
}