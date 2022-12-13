import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import {useState} from "react";

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

export default function AllegroKeyModal({allegroURL}) {
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);

  const openInNewTab = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <Modal
        open={show && allegroURL!==null}
        show={show}
        onHide={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Action required
          </Typography>
            <Stack spacing={2}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please visit Allegro service, log in and confirm action
          </Typography>
          <Button onClick={()=> {
            openInNewTab(allegroURL)
            handleClose()
          }}>Open in new tab</Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}