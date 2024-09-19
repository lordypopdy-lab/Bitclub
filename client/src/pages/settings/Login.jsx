import { useState, useEffect } from "react"
import axios from 'axios';
import toast from "react-hot-toast";
import FadeLoader from 'react-spinners/FadeLoader';
import { GoogleLogin } from 'react-google-login';
import { gapi } from "gapi-script";
import { jwtDecode } from "jwt-decode";

const Login = () => {
const [loading, setLoading] = useState(false);

    useEffect(() => {
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

    const [data, setData] = useState({
        email: '',
        password: ''
    })
    const loginUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { email, password } = data;
        try {
            const { data } = await axios.post('/login', {
                email,
                password
            })
            if (!data.error) {
                setData({});
                toast.success('Login successful. Welcome!');
                localStorage.setItem('email', email);
                localStorage.setItem('pin', data._id);
                location.href = '/Home'
            } else {
                toast.error(data.error)
                setLoading(false)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error.message);
            setLoading(false);

        }
    }


    const handleLoginSuccess = async (response) => {
        setLoading(true)
        const { tokenId } = response;
        const decoded = jwtDecode(tokenId);
        const { email, name, picture, email_verified } = decoded

        try {
            if (email_verified) {
                const { data } = await axios.post('/loginGoggle', { email, name, picture });
                if (data) {
                    toast.success("Login Successfully, Welcome!");
                    setLoading(false)
                    localStorage.setItem('email', email);
                    localStorage.setItem('pin', data._id);
                    location.href = '/Home'
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
    };

    const handleLoginFailure = (response) => {
        console.log('Login Failed:', response);
    };

    return (
        <>
            {/* <!-- preloade --> */}
            <div className="preload preload-container">
                <div className="preload-logo" style={{ backgroundImage: `url('/src/images/logo/144.png')` }}>
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
                                <GoogleLogin
                                    render={renderProps => (
                                        <a className="tf-btn md social dark" onClick={renderProps.onClick} disabled={renderProps.disabled}><img src="/src/images/logo/google.jpg" alt="img" />  Sign in with Google</a>
                                    )}
                                    clientId="170268353832-0fn4qbgklemeb9s0o5elvi99ronia9ov.apps.googleusercontent.com"
                                    onSuccess={handleLoginSuccess}
                                    onFailure={handleLoginFailure}
                                    cookiePolicy={'single_host_origin'}
                                >
                                </GoogleLogin>
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
                                        type="password"
                                        required
                                        placeholder="Your password"
                                        className="password-field"
                                        value={data.password}
                                        onChange={(e) => setData({ ...data, password: e.target.value })}
                                    />
                                    <span className="show-pass">
                                        <i className="icon-view"></i>
                                        <i className="icon-view-hide"></i>
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
