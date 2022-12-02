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
import Divider from '@mui/material/Divider';

function App() {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" >
            Strona Administratora
          </Typography>
          <Divider orientation="vertical" flexItem  />
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



        <Grid container spacing={2}>
          <Grid xs={4}>
            <Box mt={5}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 2, md: 4 }}
            >
              <IconButton size="medium" aria-label="comments">
                <DeleteIcon />
              </IconButton>

              <IconButton size="medium" aria-label="comments">
                <VisibilityIcon fontSize="inherit" />
              </IconButton>

              <TextField id="search" multiline label="search" variant="outlined" />

            </Stack>
            </Box>
            <List>
              {mockData.map((item) => (
                <ListItem

                  disablePadding>
                  <IconButton edge="start" aria-label="comments">
                    <DeleteIcon />
                  </IconButton>
                  <IconButton edge="start" aria-label="comments">
                    <VisibilityIcon />
                  </IconButton>
                  <img
                    height="40"
                    src={item["Zdjęcie"]}
                    alt={item.title}
                    loading="lazy"
                  />

                  <ListItemButton>
                    <ListItemText primary={item.Name} secondary={item.ID} />
                  </ListItemButton>
                </ListItem>))}
            </List>

          </Grid>
          <Grid xs={8}>
            <ImageList cols={4}>
              {mockData.slice(4).map((item) => (
                <ImageListItem
                  key={item.img}>
                  <img
                    src={item["Zdjęcie"]}
                    alt={item.title}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>

            <Stack spacing={2}  >
              {Object.entries(mockData[0])
                .filter(([key, value]) => typeof (value) == "string")
                .map(([key, value]) => (
                  <TextField fullWidth={true} id={key} label={key} variant="outlined" value={value} />
                ))}
            </Stack>

          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
