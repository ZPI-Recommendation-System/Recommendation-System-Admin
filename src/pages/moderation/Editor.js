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

const changeColor = '#888855'

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
    const [isLoaded, result, error] = useRequest(`${API_URL}/laptops?query=all&ids=${id}`)
    const [deletedImages, setDeletedImages] = useState({});
    function setDeleted(id) {
        setDeletedImages({...deletedImages, [id]: !deletedImages[id]})
    }
    const undeletedImages = React.useMemo(
        () => isLoaded ? result?.items[0]?.images?.filter(image => !deletedImages[image.id]) : []
    , [deletedImages, result, isLoaded])

    const [editedFields, setEditedFields] = useState({});
    useEffect(() => setEditedFields({}), [id])

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
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                //TODO add proper token
                'Authorization': 'Bearer 5335cac0-65dd-4a91-b51c-19bbd4341d0f'
            },
            body: JSON.stringify(patch)
        }).then((x) => console.log(x))
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
        <ImageList cols={6}>
            {result.items[0].images.map(item => (
                <LaptopImage key={item.url} url={item.url} setDeleted={()=>setDeleted(item.id)}
                    deleted={deletedImages[item.id]} />
            ))}
        </ImageList>
        <p>Click on inappropriate images to mark them for deletion.</p>
        <Button onClick={applyChanges} variant="outlined" color="warning" sx={{borderColor:changeColor, color: changeColor, marginBottom:"2em"}} >Apply All Changes</Button>

        <Stack spacing={2}  >
            {Object.entries(result.items[0])
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
