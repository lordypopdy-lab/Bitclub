import { useState, useEffect } from "react"
import axios from 'axios';
import toast from "react-hot-toast";
import FadeLoader from 'react-spinners/FadeLoader';
import { GoogleLogin } from '@react-oauth/google';
import { gapi } from "gapi-script";
import google from "../../images/logo/google.jpg"
import logo144 from "../../images/logo/logo144.png"
import { jwtDecode } from "jwt-decode";
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye'
import { Preloader } from "../utils/Properties";

const Login = () => {

    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);
    const [data, setData] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        Preloader()
        //////////TOKEN FETCHER////////////
        const fetcher = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
                const datas = await response.json();
                if (datas.length > 0) {
                    localStorage.setItem('tokens', JSON.stringify(datas));
                }
            } catch (error) {
                console.log(`Error fetching tokens:`, error);
            }
        }
        fetcher();
    }, [])

    gapi.load('client:auth2', () => {
        window.gapi.client.init({
            clientId: '170268353832-0fn4qbgklemeb9s0o5elvi99ronia9ov.apps.googleusercontent.com',
            plugin_name: "chat",
            scope: 'email'
        })
    })

    const loginUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { email, password } = data;
        try {
            const { data } = await axios.post('/login', {
                email,
                password
            },{
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            })
            if (!data.error) {
                setData({});
                toast.success('Login successful. Welcome!');
                localStorage.setItem('email', email);
                localStorage.setItem('pin', data._id);
                setTimeout(() => {
                    location.href = '/Home'
                }, 1000)
            } else {
                toast.error(data.error)
                setLoading(false)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(`${error.message} Here...`);
            setLoading(false);

        }
    }
    const login = async (credentialResponse) => {
        console.log("Success")
        setLoading(true)
        const { credential } = credentialResponse;
        const decoded = jwtDecode(credential);
        const { email, name, picture, email_verified } = decoded

        try {
            if (email_verified) {
                const { data } = await axios.post('/loginGoogle',
                    {
                        email,
                        name,
                        picture
                    }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                if (data) {
                    toast.success("Login Successfully, Welcome!");
                    setLoading(false)
                    localStorage.setItem('email', email);
                    localStorage.setItem('pin', data._id);
                    setTimeout(() => {
                        location.href = '/Home';
                    }, 1000);
                } else {
                    toast.error("Login Error");
                    setLoading(false)
                }
            }
        } catch (error) {
            console.log("Error, Login With Google");
            toast.error("Login failed")
            setLoading(false)
        }

    }
    const handleToggle = () => {
        if (type === 'password') {
            setIcon(eye);
            setType('text')
        } else {
            setIcon(eyeOff)
            setType('password')
        }
    }

    return (
        <>
            {/* <!-- preloade --> */}
            <div className="preload preload-container">
                <div className="preload-logo" style={{ backgroundImage: `url(${logo144})` }}>
                    <div className="spinner"></div>
                </div>
            </div>
            {/* <!-- /preload -->  */}
            <div className="header fixed-top bg-surface">
                <a href="Boarding2" className="left back-btn"><i className="icon-left-btn"></i></a>
            </div>
            <div className="pt-45 pb-20">
                <div className="tf-container">
                    <div className="mt-32">
                        <h2 className="text-center">Login Bitclub.</h2>
                        <ul className="mt-40 socials-login">
                            <li className="mt-12">
                                <a className="tf-btn md p-2 social dark">
                                    <GoogleLogin
                                        theme="filled_black"
                                        onSuccess={credentialResponse => {
                                            login(credentialResponse);
                                        }}
                                        onError={() => {
                                            console.log('Login Failed');
                                        }}
                                    /></a>
                            </li>

                        </ul>
                    </div>
                    <div className="auth-line mt-12">Or</div>
                    <form onSubmit={loginUser} className="mt-16">
                        <FadeLoader
                            color="#36d7b7"
                            loading={loading}
                            speedMultiplier={3}
                            style={{ textAlign: 'center', position: 'relative', marginLeft: '50%' }}
                        />
                        <fieldset className="mt-16">
                            <label className="label-ip">
                                <p className="mb-8 text-small"> Email</p>
                                <input
                                    type="email"
                                    placeholder="Example@gmail"
                                    value={data.email}
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                />
                            </label>
                        </fieldset>
                        <fieldset className="mt-16 mb-12">
                            <label className="label-ip">
                                <p className="mb-8 text-small">Password</p>
                                <div className="box-auth-pass">
                                    <input
                                        type={type}
                                        required
                                        placeholder="Your password"
                                        className="password-field"
                                        value={data.password}
                                        onChange={(e) => setData({ ...data, password: e.target.value })}
                                    />
                                    <span className="show-pass" onClick={handleToggle}>
                                        <Icon class="absolute mr-10" icon={icon} size={15} />
                                    </span>
                                </div>
                            </label>
                        </fieldset>
                        <a href="/RessetPassword" className="text-secondary">Forgot Password?</a>
                        <button className="mt-20">Login</button>
                        <p className="mt-20 text-center text-small">Already have a Account? &ensp;<a href="Register">Sign up</a></p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login
