import { useState, useEffect } from "react";
import { db, storage } from "./../firebase";
import { get, ref, remove } from "firebase/database";
import PostModal from "./post-modal";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { deleteObject, ref as refSt } from "firebase/storage";

function UserPosts({user}) {

    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editPost, setEditPost] = useState({});

    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);
    
    useEffect(() => {
        let userPost = [];
        get(ref(db, 'posts')).then(snapshots => {
            snapshots.forEach(snapshot => {
                if(snapshot.val().uid === user.id) {
                    userPost.push({
                        ...snapshot.val(),
                        id: snapshot.key
                    });
                }
            })
        }).then(() => {
            setPosts(userPost)
        })
    }, [user.id])

    const openEditPost = (index) => {
        setEditPost(posts[index])
        handleOpen()
    }

    const removeEditPost = () => {
        const photos = Object.values(editPost.info);
        const editPostId = editPost.id;
        photos.forEach((photo, index) => {
            const fileName = photo.url.split("%2F")[1].split("?")[0]
            deleteObject(refSt(storage, `images/${fileName}`)).then(() => {
                if(index === photos.length-1) {
                    remove(ref(db, `posts/${editPostId}`)).then(() => {
                        setPosts(prevPost =>
                            prevPost.filter(post => editPostId !== post.id)
                        )
                        handleClose();
                        setEditPost({});
                        alert("Post Deleted");
                    }).catch(() => {
                        console.log("Errof in post from DB")
                    })
                }
            }).catch(() => {
                console.log("Error in picture delete")
            })
        })
    }

    return (
        <Box sx={{overflow:"auto"}}>
            {posts.map((post, index) =>
                Object.keys(post).length !== 0 &&
                <Card key={post.id + index} sx={{ display: 'flex', marginBottom: 2, cursor: "pointer" }} onClick={() => openEditPost(index)}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                {post.title}
                            </Typography>
                        </CardContent>
                    </Box>
                    <CardMedia
                        component="img"
                        sx={{ width: 151 }}
                        image={post.info.img0.url}
                        alt={`Post Image ${index+1}`}
                    />
                </Card>
            )}
            {
                Object.keys(editPost).length !== 0 &&
                <PostModal open={open} handleClose={handleClose} editingPost={editPost} removePost={removeEditPost} />
            }
        </Box>
    )
}

export default UserPosts;