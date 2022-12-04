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
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { useState, useEffect } from 'react';
import { useRequest, API_URL } from './api';

function laptop(item, edited, setEdited) {
    return <ListItem
        key={item.id}
        sx={{ backgroundColor: edited===item.id ? "#333" : "#222", width: "100%", paddingBottom: "0.25em" }}
        disablePadding
        >
        <Stack  spacing={1}>
            <Grid alignItems="center" container>
                <Grid container xs={3}>
                    <img
                        width={"100%"}
                        src={item.images[0]?.url}
                        alt={item.name}
                        loading="lazy"
                    />
                </Grid>
                <Grid xs={9}>
                        <ListItemText primary={item.name} />
                </Grid>
            </Grid>
            <Stack direction="row">
                <Chip clickable variant="outlined" label="Delete" icon={<DeleteIcon />} />
                <Chip clickable variant="outlined" label="Mark as seen" icon={<VisibilityIcon />} />
                <Chip clickable variant="outlined" label="Edit" icon={<VisibilityIcon />} onClick={()=>setEdited(item.id)} />
            </Stack>
        </Stack>
    </ListItem>
}

function LaptopsList({setEdited, edited}) {

    const [searchTerm, setSearchTerm] = useState('')

    const [sentSearchTerm, setSentSearchTerm] = useState('')

    // search 1 second after user stopped typing
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            console.log("Searching", searchTerm)
            setSentSearchTerm(searchTerm)
        }, 1000)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    const [isLoaded, result, error] = useRequest(API_URL + "/laptops/search?query=id,name,images&limit=10&search=" + sentSearchTerm)

    if (error) {
        return <p className="text">Error: {error.message}</p>
    }
    else if (!isLoaded) {
        return <p className="text">Loading...</p>
    } else {

        return <><Box mt={5}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="center"
                alignItems="center"
                spacing={1}
            >
                <TextField id="search" multiline label="search" variant="outlined" onChange={e => setSearchTerm(e.target.value)} />
                <Chip clickable variant="outlined" label="Deleted" icon={<DeleteIcon />} />
                <Chip clickable variant="outlined" label="Unseen" icon={<VisibilityIcon />} />
            </Stack>
        </Box>
            <List>
                {result["result"].map(item=>laptop(item, edited, setEdited))}
            </List></>
    }
}

function LaptopImage({ url, onDelete }) {
    const [deleted, setDeleted] = useState(false)

    return <ImageListItem sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        }}
        onClick={() => setDeleted(!deleted)}
        >
        <DeleteIcon sx={{
            position: "absolute",
            width: "50%",
            height: "50%",
            display: !deleted ? "none" : "block",
        }} />
        <img
            style={deleted ? {opacity:0.2} : {}}
            src={url}
            alt={"Laptop"}
            loading="lazy"
        />
    </ImageListItem>   
}

function Editor({id}) {
    const [isLoaded, result, error] = useRequest(`${API_URL}/laptops/get/${id}?query=all`)
    if (error) {
        return <p className="text">Error: {error.message}</p>
    }
    else if (!isLoaded) {
        return <p className="text">Loading...</p>
    } else {
        return <>
        <ImageList cols={4}>
            {result.result.images.map(item => (
                <LaptopImage key={item.url} url={item.url} onDelete={()=>{}} />
            ))}
        </ImageList>
        <p>Click on inappropriate images to mark them for deletion.</p>
        <Button variant="outlined" sx={{marginBottom:"2em"}} >Apply Changes</Button>

        <Stack spacing={2}  >
            {Object.entries(result.result)
                // .filter(([key, value]) => typeof (value) == "string")
                .map(([key, value])=>[key, typeof (value) == "string" ? value : JSON.stringify(value)])
                .map(([key, value]) => (
                    <TextField fullWidth={true} id={key} label={key} variant="outlined" value={value} />
                ))}
        </Stack></> 

    }
}

function Moderate() {
    const [editedId, setEditedId] = useState(null)

    return <Grid container spacing={2}>
        <Grid xs={4}>
            <LaptopsList edited={editedId} setEdited={setEditedId} />
        </Grid>
        <Grid xs={8}>
            {editedId ? <Editor id={editedId} /> : <p style={{marginTop:"2.8em", marginLeft: "0.5em"}} className="text">Select laptop to edit</p>}
        </Grid>
    </Grid>

}

export default Moderate;