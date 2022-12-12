import Grid from '@mui/material/Unstable_Grid2';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { API_URL } from '../api.js';
import { useState, useEffect } from 'react';
import AllegroKeyModal from '../AllegroKeyModal';


function Jobs({token}) {
  const [allegroURL, setAllegroURL] = useState(null);


  function returnKey(key) {
    setAllegroURL(null)
    fetch(API_URL + "/allegro-url/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key: key })
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

function JobLine({ job, setAllegroURL }) {
  const [status, setStatus] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Checking status")
      job.status().then(status => {
        if (status[0] !== undefined && status[0] === "allegro-url") {
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
          ? <Button onClick={() => job.start()} disabled variant="outlined" startIcon={<CircularProgress size="0.6em" color="inherit" />}>
            Running
          </Button>
          : <Button onClick={() => job.start()} variant="outlined" startIcon={<KeyboardDoubleArrowRightIcon />}>
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

  finalMockStatus() {
    if (this.name === "ML Label") {
      this.mockStatus = "failed";
    } else if (this.name === "Scraper") {
      this.mockStatus = ["allegro-url", "https://allegro.pl/auth/oauth/authorize?response_type=code&client_id=client_id&redirect_uri=redirect_uri"];
    } else {
      this.mockStatus = "running";
    }
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
          this.finalMockStatus()
        }
      )
  }
}

export default Jobs;