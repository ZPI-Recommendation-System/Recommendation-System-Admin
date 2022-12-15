import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


import { Link } from "react-router-dom";
import { Routes, Route } from "react-router-dom";


import Moderate from './pages/moderation/Moderate';
import Jobs from './pages/Jobs';
import Login from './pages/Login';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {useEffect} from "react";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [token, setToken] = React.useState(window.sessionStorage.getItem("token") ?? "");

  useEffect(() => {
    setToken(window.sessionStorage.getItem("token"));
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem("token", token);
  }, [token]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" pr={3} >
            Admin Panel
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ flexGrow: 1 }}>

            {token && <MenuItem  component={Link} to="/admin/moderate">
          
                  <Typography  textAlign="center">Moderate Laptops</Typography>
          </MenuItem>}
            {token && <MenuItem component={Link} to="/admin/jobs">
                  <Typography  textAlign="center">Run Jobs</Typography>
          </MenuItem>}
          </Stack>
          {token && <MenuItem>
            <Typography textAlign="center" onClick={()=>{
              setToken("");
              window.sessionStorage.removeItem("token");
            }}>Log Out</Typography>
          </MenuItem>}
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path={"/"} element={ <Login token={token} setToken={setToken} />} />
          <Route path={"/admin"} element={ <Login token={token} setToken={setToken} />} />
          <Route path={"/admin/jobs"} element={ <Jobs token={token} />} />
          <Route path={"/admin/moderate"} element={ <Moderate token={token} />} />
        </Routes>
      </Container>
    </Box>
    </ThemeProvider>
  );
}

export default App;
