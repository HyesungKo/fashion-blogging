import { useState, useEffect } from "react";
import { Avatar, Box, Button, IconButton, Typography, TextField } from "@mui/material";
import Login from "./login";
import { Edit } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';

import { auth, db } from "./../firebase";
import { ref as dbRef, update }  from 'firebase/database';
import { signOut } from "firebase/auth";
import UserPosts from "./user-posts";



function Profile ({user, changeUserName, loggedIn, loginSuccess, logoutSuccess, toggleDrawer}) {

    const [isEditing, setIsEditing] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        setUserName(user.userName);
    }, [user.userName])

    const handleUserName = (e) => setUserName(e.target.value);

    function logOut() {
        signOut(auth).then(() => {
            logoutSuccess();
        })
    }

    const saveUserName = () => {
        const userRef = dbRef(db, `profile/${user.id}`);
        update(userRef, {
            userName: userName
        }).then(() => {
            changeUserName(userName);
            setIsEditing(false);
        }).catch(err => {
            console.log(err.message);
        })
    }

    const handleEditOpen = () => setIsEditing(true);

    if(loggedIn) {
        return (
            <Box
                sx={{ width: 375, padding: 2 }}
                role="presentation"
                // onClick={toggleDrawer(false)}
                // onKeyDown={toggleDrawer(false)}
            >
                <Box pb={1} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between"}} >
                    <Box sx={{ display: "flex", flexDirection: "row"}}>
                        <Avatar aria-label="fashion"
                            sx={{ width: 30, height: 30}}
                            variant="rounded"
                        > {
                            user.userImageUrl ?
                            <img src={user.userImageUrl} alt={`User`} />
                            :
                            <Typography>BO</Typography>
                        }
                        </Avatar>
                        <Typography variant="h6" fontWeight={700} ml={1}>{ user.userName? user.userName : "User" }</Typography>
                        {
                            !isEditing &&
                            <IconButton onClick={handleEditOpen}>
                                <Edit sx={{ fontSize: 14 }} />
                            </IconButton>
                        }
                    </Box>
                    <IconButton sx={{border: "1px #ddd solid"}} onClick={toggleDrawer(false)}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>

                </Box>

                {
                    !isEditing &&
                    <Box>
                        <Box my={2}>
                            <Typography variant="h6" fontWeight={300}>User Name</Typography>
                            <Typography variant="h5" fontWeight={600}>{user.userName? user.userName : "Not Created Yet"}</Typography>
                        </Box>

                        <Box my={2}>
                            <Typography variant="h6" fontWeight={300}>Email</Typography>
                            <Typography variant="h5" fontWeight={600}>{user.email}</Typography>
                        </Box>

                        <Box my={2}>
                            <Typography variant="h6" fontWeight={300}>Posts</Typography>
                            <UserPosts user={user} />
                        </Box>

                        <Button variant="contained" sx={{ width: "100%", marginBottom: 1}} disabled={!loggedIn} onClick={logOut}>
                            Log Out
                        </Button>
                    </Box>
                }
                {
                    isEditing &&
                    <Box>
                        <TextField sx={{ width: "100%", marginBottom: 1}} id="filled-basic" label="Username" variant="filled" value={userName} onChange={handleUserName}>
                        </TextField>
                        <Button variant="contained" sx={{ width: "100%", marginBottom: 1}} disabled={!isEditing} onClick={saveUserName}>
                            Save
                        </Button>
                    </Box>
                }

            </Box>
        )
    }

    return (
        <Login toggleDrawer={toggleDrawer} loginSuccess={loginSuccess} />
    )
}

export default Profile;