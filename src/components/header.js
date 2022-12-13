import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField';

import { db, storage } from './../firebase';
import { ref as dbRef, set }  from 'firebase/database';
import { ref as stRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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

const postItem = [

]

function HeaderBar() {

    const [title, setTitle] = React.useState("");
    const [images, setImages] = React.useState([]);
    const [imageInfo, setImageInfo] = React.useState([]);
    
    const [open, setOpen] = React.useState(false);
    const [openProfile, setOpenProfile] = React.useState(false); 

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const handleOpenProfile = () => setOpenProfile(!openProfile);

    React.useEffect(() => {
        if(images.length < 1) return;

        images.forEach(image => {
            const storageRef = stRef(storage, `images/${Math.floor(Date.now())}`);
            uploadBytes(storageRef, image).then(() => {
                getDownloadURL(storageRef).then(url => {
                    setImageInfo(prevInfo => [...prevInfo, {
                        'url': url,
                        'category': '',
                        'caption': '',
                        'link': ''
                    }]);
                })                
            })
        });
    }, [images])
    

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

    function upload() {

        if(title !== "") {
            const postId = Date.now();
            set(dbRef(db, `posts/${postId}`), {
                title: title,
            }).then(() => {
                for(let i = 0; i < imageInfo.length; i++) {
                    set(dbRef(db, `posts/${postId}/info/img${i}`), {
                        'url': imageInfo[i].url,
                        'category': imageInfo[i].category,
                        'caption': imageInfo[i].caption,
                        'link': imageInfo[i].link
                    }).then(() => {
                        if(i === images.length - 1) {
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

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="relative" style={{backgroundColor: "#222"}}>
                <Container>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Toolbar>
                            <CameraIcon sx={{ mr: 2 }} />
                            <Typography variant="h5" color="inherit" noWrap>
                                Fashion Items
                            </Typography>
                        </Toolbar>
                        <Box>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={handleOpen}
                            >
                                <AddCircleOutlineIcon sx={{ mr: 1 }} />
                                <Typography color="inherit" noWrap>
                                    New
                                </Typography>
                            </Button>

                            <Button sx={{ ml: 2 }} variant="text" disabled={false} onClick={handleOpenProfile}>
                                <AccountCircleIcon sx={{ fontSize: 35, color: "white" }} />   
                            </Button>
                        </Box>
                    </Grid>
                </Container>
         </AppBar>
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
                                <Typography variant='h6' color="inherit" noWrap>
                                Image {index+1}
                                </Typography>
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
                    
                    <Button variant="contained" sx={{ width: "100%"}} disabled={false} onClick={upload}>Upload</Button>
                </Box>
            </Modal>
        </ThemeProvider>
    );
}
export default HeaderBar;