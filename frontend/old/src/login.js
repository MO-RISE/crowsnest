import * as React from "react";

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { SnackbarProvider, useSnackbar } from 'notistack';

import { ReactComponent as CrowsnestLogo } from './crowsnest-logo.svg';

import { useLogin } from 'react-admin';

const protocol = window.location.hostname === 'localhost' ? 'http://' : 'https://'

export async function login ({username, password}) {
    
    const request = new Request(protocol + window.location.hostname + '/auth/api/login', {
        method: 'POST',
        credentials: 'include',
        body: "username="+username+"&password="+password+"&grant_type=password",
        headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}),
    });
    const response = await fetch(request)
    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail)
    } 
    return response
}


function LoginPrompt({admin}) {

    const [state, setState] = React.useState({
        username: '',
        password: '',
        showPassword: false,
        disableButton: false,
        redirectUrl: protocol + window.location.hostname + "/auth",
        redirectMessage: '',
        logged: false,
        admin: false, 
    })

    const { enqueueSnackbar } = useSnackbar();
    
    const reactAdminLogin = useLogin()
    
    const handleChange = (prop) => (event) => {
        setState({ ...state, [prop]: event.target.value, disableButton: false });
    };

    const handleToggleShowPassword = () => {
        setState({...state, showPassword: !state.showPassword})
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = React.useCallback(async () => {
        if (!state.disableButton) {
            if (state.username.length < 1 || state.password.length < 1) {
                enqueueSnackbar("Username or password are empty", {variant:"error"})
                setState({...state, disableButton: true})
            } else {
                if (admin) {
                    reactAdminLogin({username: state.username, password: state.password}).catch(
                        (e)=>{ enqueueSnackbar(e.message, {variant:"error"})}
                    )
                } else {
                    try {
                        const response = await login({username: state.username, password: state.password})                    
                        if (response.ok) {
                            window.location.replace(state.redirectUrl)
                        }
                       
                    } catch (error) {
                        enqueueSnackbar(error.message, {variant:"error"})
                    };
            
                }
            }
        }
    }, [state, admin, enqueueSnackbar, reactAdminLogin])

    const handleLogout = async() => {
        fetch(protocol +  window.location.hostname + '/auth/api/logout',{method: 'POST'}).then(response => {
            if (response.ok) {
                setState({...state, logged: false})
            } else {
                response.json().then(data => {
                    enqueueSnackbar(data.detail, {variant:"error"})
                })                
            }
        })
    }

    // Retrieve parameters from the URL
    React.useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const url = urlParams.get('url')
        if (url) {
            setState(s => ({...s, redirectUrl: url}))
        }
        const message = urlParams.get('message')
        if (message) {
            enqueueSnackbar(message, {variant:"error"})
        }

    },[enqueueSnackbar])

    // Determine if already logged in
    React.useEffect(() => {
        fetch(protocol +  window.location.hostname + '/auth/api/me',{credentials:'include',headers:{'Accept': 'application/json'}}).then(
            response => {
                if (!response.ok) {
                    setState(s => ({...s, logged: false}))
                } else {
                    response.json().then(data => {
                        setState(s => ({...s, username: data.username, logged: true, admin: data.admin}))
                    })
                }
            })
    },[])   

    // Pressing "Enter" is submits the credentials.
    React.useEffect(() => {
    const listener = event => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        handleLogin()
        }
    };
    document.addEventListener("keydown", listener);
    return () => {
        document.removeEventListener("keydown", listener)
    }
    },[handleLogin])

 
    const Login = <>
        <Box>
                    <TextField
                        sx={{m: 1, width: '25ch'}}
                        label={'Username'}
                        margin={'normal'}
                        onChange={handleChange('username')}
                        variant='outlined'
                    />
                </Box>
                <Box>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={state.showPassword ? 'text' : 'password'}
                            onChange={handleChange('password')}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleToggleShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    >
                                    {state.showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                </Box>
                <Box sx={{textAlign: 'center'}}>
                    <Button variant="text" disabled={state.disableButton} onClick={()=>handleLogin()}>Login</Button>
                </Box>
                
    </>

    const Logout = <>
        <Box sx={{textAlign: 'center'}}>
            <Typography variant='caption'>Logged-in as:</Typography>
        </Box>
        {state.admin && <Box>
            <Typography variant="caption">User Administration</Typography>
        </Box>}
        <Box sx={{textAlign: 'center'}}>
            <Typography variant='body2'>{state.username}</Typography>
        </Box>
        <Box sx={{textAlign: 'center'}}>
            {state.redirectMessage.length !== 0 && <Typography sx={{color: 'error.main'}}>{state.redirectMessage}</Typography> }
        </Box>
        <Box sx={{textAlign: 'center'}}>
            <Button variant="text" disabled={state.disableButton} onClick={()=>handleLogout()}>Logout</Button>
        </Box>
    </>

    return <Box sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 1,
                p: 2,
            }}>
                <Box sx={{
                    m: 1,
                    width: '25ch',
                    textAlign: 'center',
                }}>
                    <CrowsnestLogo style={{ height: 150, width: 150 }} />
                </Box>
                {admin && <Box sx={{textAlign: 'center'}}>
                    <Typography variant="h8">User Administration</Typography>
                </Box>}
                <Box sx={{textAlign: 'center'}}>
                    {state.redirectMessage.length !== 0 && <Typography sx={{color: 'error.main'}}>{state.redirectMessage}</Typography> }
                </Box>
                {state.logged ? Logout : Login}
            </Box>
      
    
}

export const LoginPage = ({admin}) => (
    <SnackbarProvider maxSnack={3} anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}>
        <Backdrop open>
            <LoginPrompt admin={admin} />
        </Backdrop>
    </SnackbarProvider>
)