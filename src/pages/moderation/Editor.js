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

export default function Editor({id, token, setSeed}) {
    const [isLoaded, result, error] = useRequest(`${API_URL}/laptops-crud/${id}`, {method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
    })
    const [deletedImages, setDeletedImages] = useState({});
    function setDeleted(id) {
        setDeletedImages({...deletedImages, [id]: !deletedImages[id]})
    }
    const undeletedImages = React.useMemo(
        () => isLoaded ? result?.images?.filter(image => !deletedImages[image.id]) : []
    , [deletedImages, result, isLoaded])

    const [editedFields, setEditedFields] = useState({});
    useEffect(() => setEditedFields({}), [id])

    function fieldSetter(field) {
        return e => {
            setEditedFields({...editedFields, [field]: e.target.value})
        }
    }

    console.log(result)

    function applyChanges() {
        const patch = {
            ...result,
            ...editedFields,
            images: undeletedImages,
        }
        console.log("Applying changes", id, patch)

        fetch(`${API_URL}/laptops-crud/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(patch)
        }).then((x) => console.log(x))

        setSeed(Math.random())
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
            {result.images.map(item => (
                <LaptopImage key={item.url} url={item.url} setDeleted={()=>setDeleted(item.id)}
                    deleted={deletedImages[item.id]} />
            ))}
        </ImageList>
        <p>Click on inappropriate images to mark them for deletion.</p>
        <Button onClick={applyChanges} variant="outlined" color="warning" sx={{borderColor:changeColor, color: changeColor, marginBottom:"2em"}} >Apply All Changes</Button>

        <Stack spacing={2}  >
            {Object.entries(result)
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
