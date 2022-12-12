import Grid from '@mui/material/Unstable_Grid2';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { API_URL } from '../api.js';
import { useState, useEffect } from 'react';
import AllegroKeyModal from '../AllegroKeyModal';

export default function Login({token, setToken}) {
    // login and password state
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    async function onLogin () {
        const result = await fetch(API_URL + "/login", {
            
            method: "POST",
            headers: {  "Content-Type": "application/json" },       
            body: JSON.stringify({login: login, password: password})
        })
        const json = await result.json();
        setToken(json.token)
    }

    if (token) {
        return <Typography variant="h3" textAlign="center" component="div" pr={3} >
            You're already logged in
        </Typography>
    }

  return <Stack sx={{width: "30%", margin:"5rem auto"}} spacing={1}> 
  
  <Typography variant="h3" textAlign="center" component="div" pr={3} >
            Login
          </Typography>
    <TextField id="username" label="Username" variant="outlined" 
        value={login} onChange={e=>setLogin(e.target.value)} />
    <TextField id="password" label="Password" variant="outlined"
        value={password} onChange={e=>setPassword(e.target.value)} />
    <Button onClick={onLogin} variant="contained" endIcon={<KeyboardDoubleArrowRightIcon />}>Login</Button>
     </Stack>
}
