import Grid from '@mui/material/Unstable_Grid2';

import * as React from 'react';
import { useState } from 'react';
import Editor from './Editor';
import LaptopsList from './LaptopsList';
import useLoginRedirect from '../../useLoginRedirect';

function Moderate({token}) {
    const [editedId, setEditedId] = useState(null)
    const [seed, setSeed] = useState(1)

    useLoginRedirect(token);

    return <Grid container spacing={2}>
        <Grid xs={4}>
            <LaptopsList key={seed} edited={editedId} setEdited={setEditedId} token={token} setSeed={setSeed} />
        </Grid>
        <Grid xs={8} >
            <div style={{marginTop:"2.5em", marginLeft: "0.5em"}}>
            {editedId ? <Editor id={editedId} token={token} setSeed={setSeed}/> : <p  className="text">Select laptop to edit</p>}
            </div>
        </Grid>
    </Grid>

}

export default Moderate;