import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import mockData from './mockData';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';


import Moderate from './Moderate';
import Jobs from './Jobs';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" pr={3} >
            Strona Administratora
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ flexGrow: 1 }}>
          <MenuItem >
                  <Typography textAlign="center">Run Jobs</Typography>
          </MenuItem>
          <MenuItem >
                  <Typography textAlign="center">Moderate Laptops</Typography>
          </MenuItem>
          </Stack>

          <MenuItem >
                  <Typography textAlign="center">Log Out</Typography>
          </MenuItem>
        </Toolbar>
      </AppBar>
      <Container >

    <Jobs />
      </Container>
    </Box>
    </ThemeProvider>
  );
}

export default App;
