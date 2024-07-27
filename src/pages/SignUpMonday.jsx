import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

import { signup } from '../store/actions/user.actions'
import { ImgUploader } from '../cmps/ImgUploader'
import { userService } from '../services/user'

const GOOGLE_CLIENT_ID = '255133843736-l06hptrcuqcamthngpp79bt2ub78uecd.apps.googleusercontent.com'

export function SignUpMonday() {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', imgUrl: '' })
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    async function onSignup(ev) {
        ev.preventDefault()
        if (!credentials.username || !credentials.password || !credentials.fullname) return
        await signup(credentials)
        clearState()
        navigate('/')
    }

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }

    const handleGoogleLoginSuccess = async response => {
        const profile = response.profileObj
        const googleCredentials = {
            username: profile.email,
            password: response.googleId,
            fullname: profile.name,
            imgUrl: profile.imageUrl,
        }
        await signup(googleCredentials)
        navigate('/')
    }

    const handleGoogleLoginFailure = response => {
        console.error('Google login failed', response)
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className='signup-container'>
                <form className='signup-form-monday' onSubmit={onSignup}>
                    <h2>Sign Up</h2>
                    <input
                        type='text'
                        name='fullname'
                        value={credentials.fullname}
                        placeholder='Fullname'
                        onChange={handleChange}
                        required
                    />
                    <input
                        type='text'
                        name='username'
                        value={credentials.username}
                        placeholder='Username'
                        onChange={handleChange}
                        required
                    />
                    <input
                        type='password'
                        name='password'
                        value={credentials.password}
                        placeholder='Password'
                        onChange={handleChange}
                        required
                    />
                    <ImgUploader onUploaded={onUploaded} />
                    <button className='btn-signup'>Sign Up</button>
                </form>
                <div className='google-login'>
                    <h2>Or sign up with Google</h2>
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onFailure={handleGoogleLoginFailure}
                        cookiePolicy={'single_host_origin'}
                        isSignedIn={true}
                    />
                </div>
            </div>
        </GoogleOAuthProvider>
    )
}
