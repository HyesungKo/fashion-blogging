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
import Box from '@mui/material/Box'

import { Drawer } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Profile from './profile';
import PostModal from './post-modal';

import { auth } from './../firebase';
import { onAuthStateChanged } from 'firebase/auth';

function HeaderBar() {


    const [open, setOpen] = React.useState(false);
    const [openAccount, setOpenAccount] = React.useState(false); 

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [loggedIn, setLoggedIn] = React.useState(false);

    React.useEffect(() => {
        onAuthStateChanged(auth, user => {
            if(user) {
                loginSuccess();
            }
        })
    }, [])

    const loginSuccess = () => setLoggedIn(true);
    const logoutSuccess = () => setLoggedIn(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setOpenAccount(open);
    };

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
                                sx={{ display: loggedIn ? "inline-flex" : "none" }}
                                variant="outlined"
                                color="inherit"
                                onClick={handleOpen}
                            >
                                <AddCircleOutlineIcon sx={{ mr: 1 }} />
                                <Typography color="inherit" noWrap>
                                    New
                                </Typography>
                            </Button>

                            <React.Fragment key="right">
                                <Button onClick={toggleDrawer(true)}>
                                    <AccountCircleIcon sx={{ fontSize: 35, color: "white" }} />   
                                </Button>
                                <Drawer
                                    anchor="right"
                                    open={openAccount}
                                    onClose={toggleDrawer(false)}
                                >
                                    <Profile loggedIn={loggedIn} loginSuccess={loginSuccess} logoutSuccess={logoutSuccess} toggleDrawer={toggleDrawer} />
                                </Drawer>
                            </React.Fragment>
                        </Box>
                    </Grid>
                </Container>
                <PostModal open={open} handleClose={handleClose} />
         </AppBar>
            
        </ThemeProvider>
    );
}
export default HeaderBar;