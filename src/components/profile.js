import { auth } from "./../firebase";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import Login from "./login";

function Profile ({loggedIn, loginSuccess, logoutSuccess, toggleDrawer}) {

    function logOut() {
        signOut(auth).then(() => {
            logoutSuccess();
        })
    }

    if(loggedIn) {
        return (
            <Box
                sx={{ width: 300, padding: 2 }}
                role="presentation"
                // onClick={toggleDrawer(false)}
                // onKeyDown={toggleDrawer(false)}
            >
                Profile

                <Button variant="contained" sx={{ width: "100%", marginBottom: 1}} disabled={!loggedIn} onClick={logOut}>Log Out</Button>
            </Box>
        )
    }

    return (
        <Login toggleDrawer={toggleDrawer} loginSuccess={loginSuccess} />
    )
}

export default Profile;