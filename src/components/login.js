import  { signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { auth, db } from "./../firebase";
import { ref as dbRef, set }  from 'firebase/database';

function Login({toggleDrawer, loginSuccess}) {

    const [login, setLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");  

    const switchToRegister = () => setLogin(false);
    const switchToLogin = () => setLogin(true);

    function handleEmail(e) {
        setEmail(e.target.value);      
    }

    function handlePassword(e) {
        setPassword(e.target.value);
    }

    function logInWithEmailPassword() {
        setPersistence(auth, browserLocalPersistence).then(() => {
            return signInWithEmailAndPassword(auth, email, password).then(credential => {
                set(dbRef(db, `profile/${credential.user.uid}/lastLoggedIn`) , Date.now()).then(() => {
                    alert("Login Successful!");
                    loginSuccess();
                }).catch(() => {
                    alert("Something Wrong");
                })
            }).catch(err => {
                alert(err.message);
            })
        }).catch(() => {
            alert("Something Wrong!");
        })
        
    }

    function register() {
        setPersistence(auth, browserLocalPersistence).then(() => {
            createUserWithEmailAndPassword(auth, email, password).then(credential => {
                set(dbRef(db, `profile/${credential.user.uid}`) , {
                    email: credential.user.email,
                    userName: "",
                    userImageUrl: "",
                    createdAt: Date.now(),
                    lastLoggedIn: Date.now()
                }).then(() => {
                    alert("Account Created");
                    loginSuccess();
                })
            }).catch(err => {
                alert(err.message);
            })
        }).catch(() => {
            alert("Somthings Wrong, try again!");
        })
    }

    const loginInputs = (
        <Box>
            <Typography variant="h4" mt={4} mb={3}>
                Login
            </Typography>
            <TextField sx={{ width: "100%", marginBottom: 1 }} id="login-email" label="Email" variant="outlined" value={email} onChange={handleEmail}  />
            <TextField type="password" sx={{ width: "100%", marginBottom: 1 }} id="login-password" label="Password" variant="outlined" value={password} onChange={handlePassword} />
            <Button variant="contained" sx={{ width: "100%", marginBottom: 1}} disabled={false} onClick={logInWithEmailPassword}>Log in</Button>
            <Button variant="contained" sx={{ width: "100%", marginBottom: 1}} disabled={false} onClick={switchToRegister}>Register</Button>
        </Box>
    )

    const registerInputs = (
        <Box>
            <Typography variant="h4" mt={4} mb={3}>
                Register
            </Typography>
            <TextField sx={{ width: "100%", marginBottom: 1 }} id="register-email" label="Email" value={email} onChange={handleEmail} variant="outlined" />
            <TextField type="password" sx={{ width: "100%", marginBottom: 1 }} id="register-password" label="Password" value={password} onChange={handlePassword} variant="outlined" />
            <Button variant="contained" sx={{ width: "100%", marginBottom: 1}} disabled={false} onClick={register} >Register</Button>
            <Button variant="contained" sx={{ width: "100%", marginBottom: 1}} disabled={false} onClick={switchToLogin}>Back To Login</Button>
        </Box>
    )

    return (
        <Box
            sx={{ width: 300, padding: 2 }}
            role="presentation"
            // onClick={toggleDrawer(false)}
            // onKeyDown={toggleDrawer(false)}
            >
            {
                login
                ? loginInputs
                : registerInputs
            }
            
            
        </Box>
    )
}

export default Login;