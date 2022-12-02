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
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';

function job(item) {
    return <Paper variant="outlined" p={1} elevation={0} >
        <Grid alignItems="start" container>
            
            <Grid xs={8}> <Typography p={1} variant="h5" component="div">
        {item}
      </Typography> 
      <Typography component="div" p={1}>
        {item} does the thing
      </Typography>
            </Grid>
            <Grid xs={4}>
                    <Button variant="outlined" startIcon={<VisibilityIcon />}>
                        Run
                    </Button>
            </Grid>
        </Grid>
    </Paper>
}

function Jobs() {
    return  <Box
    sx={{
      '& > :not(style)': {
        m: 1,
        pl: 2,
      },
    }}
  >{["Scraper", "ML Learn", "ML run", "Clear"].map(job)}</Box>;
}

export default Jobs;