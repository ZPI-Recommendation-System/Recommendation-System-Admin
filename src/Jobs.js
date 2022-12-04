import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import mockData from './mockData';
import ImageList from '@mui/material/ImageList';
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
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
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

function job([name, description, lastStatus]) {
    return <Paper variant="outlined" p={1} elevation={0}x >
        <Grid alignItems="center"  container>
            
            <Grid xs={8}> <Typography pt={1} variant="h5" component="div">
        {name}
        {lastStatus==="failed" &&
                    <Chip color="error" size="small" sx={{marginLeft:"1em"}}  label="Last run failed" variant="outlined" />}
        {lastStatus==="success" &&
                    <Chip color="success" size="small" sx={{marginLeft:"1em"}}  label="Last run succeeded" variant="outlined" />}
      </Typography> 
      <Typography component="div" pb={2}>
        {description}
      </Typography>
            </Grid>
            <Grid xs={4}>
              
                    <Button variant="outlined" startIcon={<KeyboardDoubleArrowRightIcon />}>
                    {lastStatus ?  "Rerun": "Run"}
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
  >{[["Scraper", "Scrapes data from allegro API", "success"], 
  ["ML Learn", "Train ML model on collected laptops data", "success"], 
  ["ML Label", "Run ML model on missing price values", "failed"], 
  ["Clear DB", "Clear the entire database", ""]].map(job)}</Box>;
}

export default Jobs;