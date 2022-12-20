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

import { Drawer } from '@mui/material';

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
        width: '25ch',
        '&:focus': {
          width: '35ch',
        },
      },
    },
  }));  

function HeaderBar() {


    const [open, setOpen] = useState(false);
    const [openAccount, setOpenAccount] = useState(false); 
    const [curUser, setCurUser] = useState({});

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [loggedIn, setLoggedIn] = useState(false);

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
                        <Toolbar sx={{ width: 280 }}>
                            <CameraIcon sx={{ mr: 2 }} />
                            <Typography variant="h5" color="inherit" noWrap>
                                Celebrity Fashion
                            </Typography>
                        </Toolbar>
                        <Search>
                            <SearchIconWrapper>
                            <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                        <Box sx={{ width: 280, display: "flex", justifyContent: "end" }}>
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