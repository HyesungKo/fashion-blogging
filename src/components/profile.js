import { useState, useEffect } from "react";
import { auth } from "./../firebase";
import { signOut } from "firebase/auth";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import Login from "./login";
import { Edit } from "@mui/icons-material";

function Profile ({user, loggedIn, loginSuccess, logoutSuccess, toggleDrawer}) {

    const [isEditing, setIsEditing] = useState(false);

    function logOut() {
        signOut(auth).then(() => {
            logoutSuccess();
        })
    }

    const handleEditOpen = () => setIsEditing(true);
    const handleEditClose = () => setIsEditing(false);

    if(loggedIn) {
        return (
            <Box
                sx={{ width: 300, padding: 2 }}
                role="presentation"
                // onClick={toggleDrawer(false)}
                // onKeyDown={toggleDrawer(false)}
            >
                <Box pb={1} sx={{ display: "flex", flexDirection: "row" }} >
                    <Avatar aria-label="fashion"
                        sx={{ width: 30, height: 30}}
                        variant="rounded"
                    > BO
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} ml={1} mr="auto">harry</Typography>
                    {
                        !isEditing &&
                        <Button variant="text" sx={{ padding: 0 }} onClick={handleEditOpen}>
                        <IconButton>
                            <Edit sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Button>}
                </Box>

                {
                    !isEditing &&
                    <Box>

                    </Box>
                }
                    <Box>

                    </Box>
                {
                    isEditing &&
                    <Box>

                        <Button onClick={handleEditClose}>
                            Save
                        </Button>
                    </Box>
                }

                <Button variant="contained" sx={{ width: "100%", marginBottom: 1}} disabled={!loggedIn} onClick={logOut}>Log Out</Button>
            </Box>
        )
    }

    return (
        <Login toggleDrawer={toggleDrawer} loginSuccess={loginSuccess} />
    )
}

export default Profile;