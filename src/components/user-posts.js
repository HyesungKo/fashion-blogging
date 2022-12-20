import { useState, useEffect } from "react";
import { db } from "./../firebase";
import { get, ref } from "firebase/database";
import PostModal from "./post-modal";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

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
    }, )

    const openEditPost = (index) => {
        setEditPost(posts[index])
        handleOpen()
    }

    return (
        <Box>
            {posts.map((post, index) =>
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
                <PostModal open={open} handleClose={handleClose} editingPost={editPost} />
            }
        </Box>
    )
}

export default UserPosts;