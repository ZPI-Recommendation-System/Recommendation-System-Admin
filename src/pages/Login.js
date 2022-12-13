import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { API_URL } from '../api.js';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Login({ token, setToken }) {
    // username and password state
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    React.useEffect(() => {
        if (token) {
            navigate('/moderate');
        }
    }, [token, navigate]);

    async function onLogin() {
        const result = await fetch(API_URL + "/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password })
        })
        const json = await result.json();
        if (json.token) {
            setToken(json.token)
        } else {
            setError("Login failed")
        }
    }

    return <Stack sx={{ width: "30%", margin: "5rem auto" }} spacing={1}>

        <Typography variant="h3" textAlign="center" component="div" pr={3} >
            Login
        </Typography>
        <TextField id="username" label="Username" variant="outlined"
            value={username} onChange={e => setUsername(e.target.value)} />
        <TextField type="password" id="password" label="Password" variant="outlined"
            value={password} onChange={e => setPassword(e.target.value)} />
        <Button onClick={onLogin} variant="contained" endIcon={<KeyboardDoubleArrowRightIcon />}>Login</Button>
        {error && <Typography textAlign="center" color="error">{error}</Typography>}
    </Stack>
}
