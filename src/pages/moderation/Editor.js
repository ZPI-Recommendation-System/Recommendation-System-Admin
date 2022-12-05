import { styled } from '@mui/material/styles';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';

import * as React from 'react';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { useRequest, API_URL } from '../../api';

const changeColor = '#555533'

function LaptopImage({ url, deleted, setDeleted }) {

    return <ImageListItem sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: deleted ? "2px solid "+changeColor : "none",
        borderRadius: "2px",
        }}
        onClick={() => {
            setDeleted(!deleted)
        }}
        >
        <DeleteIcon sx={{
            position: "absolute",
            width: "50%",
            height: "50%",
            color: changeColor,
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
const ValidationTextField = styled(TextField)((props) => (
    props.edited ? {
    '& input + fieldset': {
      borderColor: changeColor,
      borderWidth: 2,
    },
    '& label': {
      color: changeColor,
    }
  } : {}
  ));

export default function Editor({id}) {
    const [isLoaded, result, error] = useRequest(`${API_URL}/laptops/get/${id}?query=all`)

    const [deletedImages, setDeletedImages] = useState({});
    function setDeleted(id) {
        setDeletedImages({...deletedImages, [id]: !deletedImages[id]})
    }
    const undeletedImages = React.useMemo(
        () => result?.result?.images.filter(image => !deletedImages[image.id])
    , [deletedImages, result])

    const [editedFields, setEditedFields] = useState({});
    function fieldSetter(field) {
        return e => {
            setEditedFields({...editedFields, [field]: e.target.value})
        }
    }

    function applyChanges() {
        const patch = {
            ...editedFields,
            images: undeletedImages.map(image => image.id)
        }
        console.log("Applying changes", id, patch)

        fetch(`${API_URL}/laptops-crud/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patch)
        })
    }

    useEffect(() => {
        console.log(undeletedImages)
    }, [deletedImages, undeletedImages])

    if (error) {
        return <p className="text">Error: {error.message}</p>
    }
    else if (!isLoaded) {
        return <p className="text">Loading...</p>
    } else {
        return <>
        <ImageList cols={4}>
            {result.result.images.map(item => (
                <LaptopImage key={item.url} url={item.url} setDeleted={()=>setDeleted(item.id)}
                    deleted={deletedImages[item.id]} />
            ))}
        </ImageList>
        <p>Click on inappropriate images to mark them for deletion.</p>
        <Button onClick={applyChanges} variant="outlined" color="warning" sx={{borderColor:changeColor, color: changeColor, marginBottom:"2em"}} >Apply All Changes</Button>

        <Stack spacing={2}  >
            {Object.entries(result.result)
                // .filter(([key, value]) => typeof (value) == "string")
                .map(([key, value])=>[key, typeof (value) == "string" ? value : JSON.stringify(value)])
                .map(([key, value]) => (
                    <ValidationTextField edited={editedFields[key] !==undefined}  
                    fullWidth={true} id={key} label={key} variant="outlined"
                     value={editedFields[key]!==undefined ? editedFields[key] : value} 
                     onChange={fieldSetter(key)} />
                ))}
        </Stack></> 

    }
}
