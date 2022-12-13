import Grid from '@mui/material/Unstable_Grid2';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import * as React from 'react';
import {useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import {API_URL} from '../api.js';
import AllegroKeyModal from '../AllegroKeyModal';
import useLoginRedirect from '../useLoginRedirect';

function Jobs({token}) {
  useLoginRedirect(token);

  const [allegroURL, setAllegroURL] = useState(null);
  const [runningJob, setRunningJob] = useState(undefined);

  let jobs = [new Job("Scraper", "Scrapes data from allegro API", token),
    new Job("ML Learn", "Train ML model on collected laptops data", token),
    new Job("ML Label", "Run ML model on missing price values", token),
    new Job("Clear DB", "Clear the entire database", token)]

  return <Box
      sx={{
        '& > :not(style)': {
          m: 1,
          pl: 2,
        },
      }}
  ><AllegroKeyModal allegroURL={allegroURL}></AllegroKeyModal>
    {jobs.map((job) => <JobLine setRunningJob={setRunningJob} runningJob={runningJob} setAllegroURL={setAllegroURL} job={job}></JobLine>)}
  </Box>;
}

function JobLine({ setRunningJob, runningJob, job, setAllegroURL }) {
  const [buttonStatus, setButtonStatus] = useState("loading");
  const [status, setStatus] = useState(null);
  const [lastRunStatus, setLastRunStatus] = useState("");

  useEffect(() => {
    const interval = setInterval(async () => {
      let newStatus = await job.status();
      if (job.name === "Scraper") {
        console.log(newStatus)
      }
      setStatus(newStatus)
    }, 5000)
    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (status === null) {
      return
    }

    if (runningJob === undefined) {
      setRunningJob(null)
      return;
    }

    if (status.jobName === "scraper" && status.status === "auth") {
      setAllegroURL(status.lastPayload.link)
      return;
    }

    setLastRunStatus(status.lastRunStatus)

    if (status.status === "running" || status.status === "in_progress") {
      setRunningJob(job)
    } else if (runningJob !== null && runningJob.name === job.name && (status.lastRunStatus === "ok" || status.lastRunStatus === "error")) {
      setRunningJob(null)
    }

  }, [status])

  useEffect(() => {
    if (runningJob === undefined) {
      setButtonStatus("loading")
    } else if (runningJob === null) {
      setButtonStatus("")
    } else if ( runningJob.name !== job.name) {
      setButtonStatus("another_running")
    } else if (runningJob.name === job.name) {
      setButtonStatus("running")
    }
  }, [runningJob])

  let button;

   async function start() {
    setRunningJob(job);
    setLastRunStatus("")
    job.start();
  }

  if (buttonStatus === "loading") {
    button =
        <Button disabled variant="outlined" startIcon={<CircularProgress size="0.6em" color="inherit" />}>
          Loading
        </Button>
  }else if (buttonStatus === "running") {
    button =
        <Button disabled variant="outlined" startIcon={<CircularProgress size="0.6em" color="inherit" />}>
          Running
        </Button>
  }  else if (buttonStatus === "another_running") {
    button =
        <Button disabled variant="outlined" startIcon={<KeyboardDoubleArrowRightIcon />}>
          Run
        </Button>
  } else {
    button =
        <Button onClick={start} variant="outlined" startIcon={<KeyboardDoubleArrowRightIcon />}>
          Run
        </Button>
  }

  return <Paper variant="outlined" p={1} elevation={0} >
    <Grid alignItems="center" container>
      <Grid xs={8}> <Typography pt={1} variant="h5" component="div">
        {job.name}
        {lastRunStatus === "error" &&
            <Chip color="error" size="small" sx={{ marginLeft: "1em" }} label="Last run failed" variant="outlined" />}
        {lastRunStatus === "ok" &&
            <Chip color="success" size="small" sx={{ marginLeft: "1em" }} label="Last run succeeded" variant="outlined" />}
      </Typography>
        <Typography component="div" pb={2}>
          {job.description}
        </Typography>
      </Grid>
      <Grid xs={4}>
        {button}
      </Grid>
    </Grid>
  </Paper>
}

class Job {
  constructor(name, description, token) {
    this.name = name;
    this.description = description;
    this.token = token;
  }

  async status() {
    const response = await fetch(API_URL + "/jobs/status/" + this.name.toLowerCase().replaceAll(" ", "_"), {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.token,
      },
    })

    return await response.json()
  }

  start() {
    console.log("Starting job", this.name);

    fetch(API_URL + "/jobs/request", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      },
      body: JSON.stringify({
        'jobName': this.name.toLowerCase().replaceAll(" ", "_"),
        'payload': {}
      })
    }).then((response) => {
      return response.json()
    })
  }
}

export default Jobs;
