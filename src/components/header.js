import { useState, useEffect, Fragment } from 'react';
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

import { Drawer, IconButton } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Profile from './profile';
import PostModal from './post-modal';

import { auth, db } from './../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as dbRef, set, get }  from 'firebase/database';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
            '&:focus': {
            width: '25ch',
            },
        },
    },
}));

function HeaderBar({handleSearch}) {
    const [open, setOpen] = useState(false);
    const [openAccount, setOpenAccount] = useState(false); 
    const [curUser, setCurUser] = useState({});
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [loggedIn, setLoggedIn] = useState(false);
    
    useEffect(() => {
        const handleWindowResize = () => {
            setScreenWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    })
    

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if(user) {
                set(dbRef(db, `profile/${user.uid}/lastLoggedIn`) , Date.now()).then(() => {
                    get(dbRef(db, `profile/${user.uid}`)).then(snapshot => {
                        setCurUser(snapshot.val());
                        loginSuccess();
                    })
                })
            }
        })
    }, [])

    const changeUserName = (userName) => {
        setCurUser(prevUser => ({
            ...prevUser,
            userName: userName
        }))
    }

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
            <AppBar position="sticky" style={{backgroundColor: "#222"}}>
                <Container>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box width={screenWidth < 1000 ? "100vw" : "300px"} sx={{display: "flex", justifyContent: "space-between" }}>
                            <Toolbar>
                                <CameraIcon sx={{ mr: 1 }} />
                                <Typography variant="h5" color="inherit" noWrap fontSize={22}>
                                    CELEBRITY FASHION
                                </Typography>
                            </Toolbar>
                            <Box sx={{display: screenWidth >= 1000 ? "none" : "flex", justifyContent: "end" }}>
                                <Fragment key="right">
                                    <Button sx={{padding: 0}} onClick={toggleDrawer(true)}>
                                        <AccountCircleIcon sx={{fontSize: 30, color: "white", marginLeft: "auto"}} />   
                                    </Button>
                                    <Drawer
                                        anchor="right"
                                        open={openAccount}
                                        onClose={toggleDrawer(false)}
                                        >
                                        <Profile user={curUser} changeUserName={changeUserName} loggedIn={loggedIn} loginSuccess={loginSuccess} logoutSuccess={logoutSuccess} toggleDrawer={toggleDrawer} />
                                    </Drawer>
                                </Fragment>
                            </Box>
                        </Box>
                        {
                            screenWidth < 1000 ?
                            <Box width={"100vw"} display={"flex"} justifyContent={"space-between"} mb={1}>
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Search…"
                                        inputProps={{ 'aria-label': 'search' }}
                                        onChange={e => handleSearch(e.target.value)}
                                    />
                                </Search>
                                <IconButton
                                    sx={{ display: loggedIn && screenWidth < 1000 ? "inline-flex" : "none", paddingRight: 0 }}
                                    color="inherit"
                                    onClick={handleOpen}
                                >
                                    <AddCircleOutlineIcon sx={{marginLeft: "auto"}} />
                                </IconButton>
                            </Box>
                            :
                            <Search >
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                    onChange={e => handleSearch(e.target.value)}
                                />
                            </Search>
                        }
                        <Box sx={{ width: 300, display: screenWidth < 1000 ? "none" : "flex", justifyContent: "end" }}>
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

                            <Fragment key="right">
                                <Button onClick={toggleDrawer(true)}>
                                    <AccountCircleIcon sx={{ fontSize: 35, color: "white" }} />   
                                </Button>
                                <Drawer
                                    anchor="right"
                                    open={openAccount}
                                    onClose={toggleDrawer(false)}
                                >
                                    <Profile user={curUser} changeUserName={changeUserName} loggedIn={loggedIn} loginSuccess={loginSuccess} logoutSuccess={logoutSuccess} toggleDrawer={toggleDrawer} />
                                </Drawer>
                            </Fragment>
                        </Box>
                    </Grid>
                </Container>
                <PostModal open={open} handleClose={handleClose} editingPost={null}/>
         </AppBar>
            
        </ThemeProvider>
    );
}
export default HeaderBar;