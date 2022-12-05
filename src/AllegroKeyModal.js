import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';

import TextField from '@mui/material/TextField';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AllegroKeyModal({allegroURL, returnKey}) {

    const [key, setKey] = React.useState("");

  return (
    <div>
      <Modal
        open={allegroURL!==null}
        onClose={()=>returnKey(key)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Action required
          </Typography>
            <Stack spacing={2}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please visit this link and copy the key here
          </Typography>
          <a href={allegroURL} target="blank">
            {allegroURL}
          </a>
          <TextField id="api-key" label="API Key from the link" 
            value={key} onChange={e=>setKey(e.target.value)} />
            <Button onClick={()=>returnKey(key)}>Send it</Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}