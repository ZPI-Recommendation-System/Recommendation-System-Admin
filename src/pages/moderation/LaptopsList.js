import Grid from '@mui/material/Unstable_Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import _ from 'lodash';

import * as React from 'react';
import Chip from '@mui/material/Chip';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useState, useRef, useEffect } from 'react';
import { useRequest, API_URL } from '../../api';

function Laptop(item, edited, setEdited, token, deleteItem) {
    return <ListItem
        key={item.id}
        sx={{ backgroundColor: edited === item.id ? "#333" : "#222", width: "100%", paddingBottom: "0.25em" }}
        disablePadding
    >
        <Stack spacing={1}>
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
                <Chip clickable variant="outlined" label="Delete" icon={<DeleteIcon />} onClick={() => deleteItem(item.id)} />
                {/*<Chip clickable variant="outlined" label="Mark as seen" icon={<VisibilityIcon />} />*/}
                <Chip clickable variant="outlined" label="Edit" icon={<VisibilityIcon />} onClick={() => setEdited(item.id)} />
            </Stack>
        </Stack>
    </ListItem>
}

export default function LaptopsList({ setEdited, edited, token, setSeed }) {

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

    const [page, setPage] = useState(0);
    const pageItems = useRef([]);
    useEffect(() => {
        console.log("Results reset")
        setPage(0);
        pageItems.current = [];
    }, [searchTerm]);

    const deleteItem = (itemId) => {
        fetch(`${API_URL}/laptops-crud/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        }).then((x) => console.log(x))

        setSeed(Math.random())
    }

    function loadMore() {
        setPage(page+1);
    }

    const limit = 20;
    
    function flatPageItems() {
        // uniqBy is needed for the React key prop correctness
        return _.uniqBy(_.flatten(pageItems.current), "id");
    }

    const [isLoaded, result, error] = useRequest(API_URL + `/laptops/search?query=id,name,images&limit=${limit}&search=${sentSearchTerm}&page=${page}`)

    if (error) {
        return <p className="text">Error: {error.message}</p>
    }
    else if (!isLoaded) {
        return <p className="text">Loading...</p>
    } else {
        const currentPageItems = result["items"];
        pageItems.current[page] = currentPageItems;
        
        const showMoreButton = currentPageItems.length >= limit;
        return <><Box mt={5}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="left"
                alignItems="center"
                spacing={1}
            >
                <TextField id="search" multiline label="search" variant="outlined" onChange={e => setSearchTerm(e.target.value)} />
                {/*<Chip clickable variant="outlined" label="Deleted" icon={<DeleteIcon />} />*/}
                {/*<Chip clickable variant="outlined" label="Unseen" icon={<VisibilityIcon />} />*/}
            </Stack>
        </Box>
                <List sx={{ height: "70vh", overflowY:"scroll", overflowX:"hidden" }}>
                {flatPageItems().map(item => Laptop(item, edited, setEdited, token, deleteItem))}
                {showMoreButton && <Chip sx={{marginTop:"0.5em"}} clickable variant="filled" label="Load more" icon={<MoreHorizIcon/>} onClick={loadMore} />}
            </List></>
    }
}
