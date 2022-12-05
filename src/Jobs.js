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
import CircularProgress from '@mui/material/CircularProgress';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { API_URL } from './api.js';
import { useState, useEffect } from 'react';
import AllegroKeyModal from './AllegroKeyModal';

function JobLine({ job, setAllegroURL }) {
  const [status, setStatus] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Checking status")
      job.status().then(status =>{
        if (status[0] !==undefined && status[0]==="allegro-url") {
          setAllegroURL(status[1])
          setStatus("running")
        } else {
          setStatus(status)
        }
      })
      
    }, 1000);
    return () => clearInterval(interval);
  });

  return <Paper variant="outlined" p={1} elevation={0} x >
    <Grid alignItems="center" container>
      <Grid xs={8}> <Typography pt={1} variant="h5" component="div">
        {job.name}
        {status === "failed" &&
          <Chip color="error" size="small" sx={{ marginLeft: "1em" }} label="Last run failed" variant="outlined" />}
        {status === "success" &&
          <Chip color="success" size="small" sx={{ marginLeft: "1em" }} label="Last run succeeded" variant="outlined" />}
      </Typography>
        <Typography component="div" pb={2}>
          {job.description}
        </Typography>
      </Grid>
      <Grid xs={4}>
        {status === "running"
          ? <Button onClick={()=>job.start()} disabled variant="outlined" startIcon={<CircularProgress size="0.6em" color="inherit" />}>
            Running
          </Button>
          : <Button onClick={()=>job.start()} variant="outlined" startIcon={<KeyboardDoubleArrowRightIcon />}>
            {status ? "Rerun" : "Run"}
          </Button>
        }
      </Grid>
    </Grid>
  </Paper>
}

class Job {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.mockStatus = "";
  }

  async status() {
    await new Promise(r => setTimeout(r, 1000));
    return this.mockStatus;
  }

  start() {
    console.log("Starting job", this.name);
    fetch(API_URL + "/jobs/" + this.name)
      .then(res => {
        if (!res.ok) {
          // make the promise be rejected if we didn't get a 2xx response
          throw new Error(`${res.status}: ${res.statusText}`, { cause: res });
        } else {
          return res.json()
        }
      })
      .then(
        (result) => {
          console.log("Job start result", result)
        },
        (error) => {
          console.log("Job start error", error)
          if (this.name === "ML Label"){
            this.mockStatus = "failed";
          } else if (this.name=="Scraper") {
            this.mockStatus = ["allegro-url", "https://allegro.pl/auth/oauth/authorize?response_type=code&client_id=client_id&redirect_uri=redirect_uri"];
          } else {
            this.mockStatus = "running";
          }
        }
      )
  }
}


function Jobs() {
  const [allegroURL, setAllegroURL] = useState(null);


  function returnKey(key) {
    setAllegroURL(null)
    fetch(API_URL + "/allegro-url/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({key: key})
      })
  }

  return <Box
    sx={{
      '& > :not(style)': {
        m: 1,
        pl: 2,
      },
    }}
  ><AllegroKeyModal allegroURL={allegroURL} returnKey={returnKey}></AllegroKeyModal>
    {
      // rewrite this table to use Job class
      [new Job("Scraper", "Scrapes data from allegro API"),
      new Job("ML Learn", "Train ML model on collected laptops data"),
      new Job("ML Label", "Run ML model on missing price values"),
      new Job("Clear DB", "Clear the entire database")]
        .map(job => <JobLine setAllegroURL={setAllegroURL} job={job}></JobLine>)}</Box>;
}

export default Jobs;