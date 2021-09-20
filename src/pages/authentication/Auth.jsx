import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux'
import Axios from 'axios';
import { Button, ClickAwayListener } from '@material-ui/core'
import { updateUserData } from '../../redux/actions'
import Tooltip from '../../components/Tooltip';
import Loader from './Loader';
import url from '../../service';
import './login.css';

const Auth = () => {
    const userData = useSelector(state => state.userData)
    const history = useHistory();
    const containerRef = useRef()
    const [loginData, setLoginData] = useState({ username: '', password: '' })
    const [registerData, setRegisterData] = useState({ firstName: '', lastName: '', username: '', password: '', passwordCheck: '' })
    const [isLoginTooltip, setIsLoginTooltip] = useState(false)
    const [isRegisterTooltip, setIsRegisterTooltip] = useState(false)
    const [error, setError] = useState('');
    const token = localStorage.getItem('auth-token')
    const dispatch = useDispatch();

    useEffect(() => {
        if (userData.token) history.push("/")
    }, [userData, history])

    useEffect(() => {
        const handleEnterSubmit = (event) => {
            if (event.keyCode === 13) {
                if (containerRef.current.classList[1] === 'right-panel-active') registerSubmit()
                else loginSubmit(loginData)
            }
        }

        window.addEventListener('keyup', handleEnterSubmit)
        return () => window.removeEventListener('keyup', handleEnterSubmit)
    })

    const loginSubmit = async (user) => {
        try {
            const loginRes = await Axios.post(`${url}/users/login`, user || loginData);
            dispatch(updateUserData(loginRes.data))
            localStorage.setItem('auth-token', loginRes.data.token)
            history.push('/')
        } catch (err) {
            setIsLoginTooltip(true)
            setError(err.response.data.message);
        }
    }

    const registerSubmit = async () => {
        try {
            await Axios.post(`${url}/users/register`, registerData);
            const user = {
                username: registerData.username,
                password: registerData.password,
            }
            loginSubmit(user)
        } catch (err) {
            setIsRegisterTooltip(true)
            setError(err.response.data.message);
        }
    }

    const handleSetRegisterData = ({ target: { name, value } }) => {
        setRegisterData(prevState => ({ ...prevState, [name]: value }))
    }

    const handleSetLoginData = ({ target: { name, value } }) => {
        setLoginData(prevState => ({ ...prevState, [name]: value }))
    }

    return (
        <div id="auth-container" className="animate__animated animate__zoomIn animate__faster">
            {!token ?
                <div ref={containerRef} className="container" id="container">
                    <div className="form-container sign-up-container">
                        <div id="form">
                            <h1>Create Account</h1>
                            <input onChange={handleSetRegisterData} type="text" name="firstName" placeholder="First Name" />
                            <input onChange={handleSetRegisterData} type="text" name="lastName" placeholder="Last Name" />
                            <input onChange={handleSetRegisterData} type="username" name="username" placeholder="Username" />
                            <input onChange={handleSetRegisterData} type="password" name="password" placeholder="Password" />
                            <input onChange={handleSetRegisterData} type="password" name="passwordCheck" placeholder="Confirm Password" />
                            <ClickAwayListener onClickAway={() => setIsRegisterTooltip(false)}>
                                <Tooltip
                                    open={isRegisterTooltip}
                                    title={error}
                                    children={<Button onClick={registerSubmit}>Sign Up</Button>}
                                />
                            </ClickAwayListener>
                        </div>
                    </div>
                    <div className="form-container sign-in-container">
                        <div id="form">
                            <h1>Sign in</h1>
                            <input type="text" onChange={handleSetLoginData} name="username" placeholder="Username" />
                            <input type="password" onChange={handleSetLoginData} name="password" placeholder="Password" />
                            <ClickAwayListener onClickAway={() => setIsLoginTooltip(false)}>
                                <Tooltip
                                    open={isLoginTooltip}
                                    title={error}
                                    children={<Button onClick={() => loginSubmit(loginData)}>Sign In</Button>}
                                />
                            </ClickAwayListener>
                        </div>
                    </div>
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h2>Welcome Back!</h2>
                                <p>Already have an account? We want to make sure it's really you. Please enter your account details.</p>
                                <Button onClick={() => {
                                    setError('')
                                    setIsRegisterTooltip(false)
                                    containerRef.current.classList.remove("right-panel-active")
                                }} id="signIn">Sign In</Button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h2>Welcome!</h2>
                                <p>We want to get to know you! Enter some details and start your journey with us.</p>
                                <Button onClick={() => {
                                    setError('')
                                    setIsLoginTooltip(false)
                                    containerRef.current.classList.add("right-panel-active")
                                }} id="signUp">Sign Up</Button>
                            </div>
                        </div>
                    </div>
                </div> : <Loader />
            }
        </div>
    )
}

export default Auth