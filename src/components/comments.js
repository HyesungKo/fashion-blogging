import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { db, auth } from './../firebase'
import { ref, push, onValue, get, remove } from 'firebase/database';

function Comments({openComment, post}) {
    const [comment, setComment] = useState("");
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [commentList, setCommentList] = useState([])

    useEffect(() => {
        if(auth.currentUser) {
            setUserLoggedIn(true);
            get(ref(db, `profile/${auth.currentUser.uid}/userName`)).then(snapshot => {
                setUserName(snapshot.val());
            })
        }

        onValue(ref(db, `posts/${post.id}/comments`), snapshots => {
            setCommentList([]);
            snapshots.forEach(snapshot => {
                const comment = snapshot.val();
                if(comment !== null) {
                    comment['key'] = snapshot.key;
                    setCommentList(prevCommentList => [...prevCommentList, comment]);
                }
            })
        })
    }, [post.id])

    const handleComment = (e) => {
        setComment(e.target.value);
    }

    const uploadComment = () => {
        if(userLoggedIn && comment !== "") {
            const commentRef = ref(db, `posts/${post.id}/comments`);
            push(commentRef, {
                comment: comment,
                userId: auth.currentUser.uid,
                userName: userName,
                createdAt: Date.now()
            }).then(() => {
                setComment("");  
            }).catch((err) => {
                console.log(err.message);
            })
        }
    }

    const deleteComment = (commentKey) => {
        const commentRef = ref(db, `posts/${post.id}/comments/${commentKey}`)
        remove(commentRef).then(() => {

        }).catch(err => {
            console.log(err.message);
        })
    }

    const isValidUrl = (str) => {
        let url;
        try {
            url = new URL(str);
        } catch (error) {
            return false
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    return (
        // openComment &&
        <Box pt={1} maxHeight={300}>
            <Box height={!openComment && 0} maxHeight={260} overflow={"auto"}>
                {
                    commentList.length !== 0 &&
                    commentList.map((comment, index) =>
                        <Box key={`${post.id} comment ${index+1}`} sx={{display: "flex", justifyContent: "space-between"}}>
                            <Box pt={0.5} display={"flex"}>
                                <Typography fontWeight={500} fontSize={17} pr={2}>{comment.userName}</Typography>
                                <Typography fontSize={17}>{
                                    comment.comment.split(" ").map((word) => {
                                        if(isValidUrl(word)) {
                                            return <a style={{color: "#1976d2"}} href={word}>{word+ " "} </a>
                                        }
                                        return word + " "
                                    })
                                }</Typography>
                            </Box>
                            {
                                auth.currentUser && auth.currentUser.uid === comment.userId &&
                                <IconButton sx={{padding: 0, marginLeft: 2}} onClick={() => deleteComment(comment.key)}>
                                    <DeleteOutlineIcon fontSize='15' />
                                </IconButton>
                            }
                        </Box>
                    )
                }
            </Box>
            {
                openComment && (
                    userLoggedIn ?
                    <Box mt={1} sx={{ display: "flex"}}>
                        <TextField size='small' sx={{ width: "95%", height: 30}} id="outlined-basic" label="comment.." variant="outlined" value={comment} onChange={handleComment} />
                        <IconButton variant="contained" onClick={uploadComment}>
                            <SendIcon />
                        </IconButton>
                    </Box>
                    :
                    <Box mt={2}>
                        <Typography variant='h6' fontWeight={500}>
                            Login to Leave comments!
                        </Typography>
                    </Box>
                )
            }
        </Box>
    )
}

export default Comments;