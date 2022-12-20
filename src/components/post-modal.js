import { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

import { db, storage, auth } from './../firebase';
import { ref as dbRef, set, update }  from 'firebase/database';
import { ref as stRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxWidth: "95%",
    maxHeight: "80%",
    bgcolor: 'background.paper',
    border: '2px solid #aaa',
    boxShadow: 24,
    p: 4,
    overflow: 'auto'
};

function PostModal({open, handleClose, editingPost}) {

    const [title, setTitle] = useState("");
    const [images, setImages] = useState([]);
    const [imageInfo, setImageInfo] = useState([]);

    useEffect(() => {
        if(editingPost !== null) {
            setTitle(editingPost.title)
            setImageInfo([])
            
            Object.values(editingPost.info).forEach(value => {
                setImageInfo(prevInfo => [...prevInfo, value]);
            })
        } else  {
            if(images.length < 1) return;
            images.forEach((image, index) => {
                const storageRef = stRef(storage, `images/${Math.floor(Date.now())}${index}`);
                uploadBytes(storageRef, image).then(() => {
                    getDownloadURL(storageRef).then(url => {
                        setImageInfo(prevInfo => [...prevInfo, {
                            url: url,
                            category: '',
                            caption: '',
                            link: '',
                        }]);
                    })                
                })
            });
        }

    }, [images, editingPost])
    

    function onImageChange(e) {
        setImages([...e.target.files]);
    }

    function handleTitle(e) {
        setTitle(e.target.value);
    }

    function handleCategory(index, e) {
        setImageInfo(
            imageInfo.map((info, i) => 
                i === index
                ? {...info, category: e.target.value}
                : {...info}
            )
        )
    }

    function handleCaption(index, e) {
        setImageInfo(
            imageInfo.map((info, i) => 
                i === index
                ? {...info, caption: e.target.value}
                : {...info}
            )
        )
    }

    function handleLink(index, e) {
        setImageInfo(
            imageInfo.map((info, i) => 
                i === index
                ? {...info, link: e.target.value}
                : {...info}
            )
        )
    }

    function uploadPost() {
        if(title !== "") {
            let postId;
            let modifiedAt = Date.now();
            if(editingPost) {
                postId = editingPost.id
            } else {
                postId = modifiedAt;
            }
            const userId = auth.currentUser.uid;

            if(editingPost) {
                update(dbRef(db, `posts/${postId}`), {
                    title: title,
                    uid: userId,
                    createdAt: postId,
                    modifiedAt: modifiedAt
                }).then(() => {
                    for(let i = 0; i < imageInfo.length; i++) {
                        update(dbRef(db, `posts/${postId}/info/img${i}`), {
                            url: imageInfo[i].url,
                            category: imageInfo[i].category,
                            caption: imageInfo[i].caption,
                            link: imageInfo[i].link
                        }).then(() => {
                            if(i === imageInfo.length - 1) {
                                alert("Saved!!")
                            }
                        })
                    }
                }).catch((e) => {
                    alert("error!");
                })
            } else {
                set(dbRef(db, `posts/${postId}`), {
                    title: title,
                    uid: userId,
                    createdAt: postId,
                    modifiedAt: modifiedAt
                }).then(() => {
                    for(let i = 0; i < imageInfo.length; i++) {
                        set(dbRef(db, `posts/${postId}/info/img${i}`), {
                            url: imageInfo[i].url,
                            category: imageInfo[i].category,
                            caption: imageInfo[i].caption,
                            link: imageInfo[i].link
                        }).then(() => {
                            if(i === imageInfo.length - 1) {
                                setTitle("");
                                setImages([]);
                                setImageInfo([]);
                                handleClose()
                                alert("Posted!!")
                            }
                        })
                    }
                }).catch((e) => {
                    alert("error!");
                })
            }

        }
    }

    const removePicture = (index) => {
        setImageInfo(prevImageInfo => 
            prevImageInfo.filter((val, i) => i !== index)    
        )
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h5" component="h2">
                    Post Style
                </Typography>
                <TextField sx={{ width: "100%" }} id="title" label="Title" variant="standard" value={title} onChange={handleTitle} />
                
                <input style={{ margin: 10}} type="file" multiple accept="image/*" onChange={onImageChange} />
                
                {
                    imageInfo.map((info, index) =>
                        
                        <Box sx={{ pl: 1, py: 1 }} key={index}>
                            <Box mb={1} sx={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                <Typography variant='h6' color="inherit" noWrap>
                                    Image {index+1}
                                </Typography>
                                <IconButton onClick={() => removePicture(index)}>
                                    <DeleteForeverIcon sx={{fontSize: 30, color: "red"}} />
                                </IconButton>
                            </Box>
                            <img src={info.url} style={{objectFit: "contain", width: "100%", height: 400, backgroundColor: "black"}} alt="" />
                            <FormControl fullWidth sx={{ width: "100%", marginTop: 1 }}>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="category-selector"
                                    id="category-selector"
                                    value={imageInfo[index].category}
                                    defaultValue={"Accessories"}
                                    label="Category"
                                    onChange={e=>handleCategory(index, e)}
                                >
                                    <MenuItem value={"Person"}>Person</MenuItem>
                                    <MenuItem value={"Accessories"}>Accessories</MenuItem>
                                    <MenuItem value={"Bags"}>Bags</MenuItem>
                                    <MenuItem value={"Bottoms"}>Bottoms</MenuItem>
                                    <MenuItem value={"Active Wear"}>Active Wear</MenuItem>
                                    <MenuItem value={"Dresses"}>Dresses</MenuItem>
                                    <MenuItem value={"Tops"}>Tops</MenuItem>
                                    <MenuItem value={"Sunglasses"}>Sunglasses</MenuItem>
                                    <MenuItem value={"Shoes"}>Shoes</MenuItem>
                                    <MenuItem value={"Others"}>Others</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField sx={{ width: "100%", margin: 1 }} label="Caption" variant="standard" value={imageInfo[index].caption} onChange={e=>handleCaption(index, e)} />
                            <TextField sx={{ width: "100%", margin: 1 }} label="Link" variant="standard" value={imageInfo[index].link} onChange={e => handleLink(index, e)} />
                        </Box>
                    )
                }
                
                <Button variant="contained" sx={{ width: "100%"}} disabled={false} onClick={uploadPost}>{editingPost? "Save": "Upload"}</Button>
                
            </Box>
        </Modal>
    )

}

export default PostModal;