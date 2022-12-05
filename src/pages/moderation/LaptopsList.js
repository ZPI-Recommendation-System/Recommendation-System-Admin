import Grid from '@mui/material/Unstable_Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

import * as React from 'react';
import Chip from '@mui/material/Chip';
import { useState, useEffect } from 'react';
import { useRequest, API_URL } from '../../api';

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

export default function LaptopsList({setEdited, edited}) {

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
