import { useState } from 'react'
import { useNavigate } from 'react-router'

import { signup } from '../store/actions/user.actions'

import { ImgUploader } from '../cmps/ImgUploader'
import { userService } from '../services/user'

export function Signup() {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    function clearState() {
        setCredentials({ email: '', password: '', fullname: '', imgUrl: '' })
    }

    function handleChange(ev) {
        const type = ev.target.type

        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    async function onSignup(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.email || !credentials.password || !credentials.fullname) return
        await signup(credentials)
        clearState()
        navigate('/board')
    }

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }

    return (
        <div className='signup-container'>
        <form className="signup-form-monday" onSubmit={onSignup}>
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
                name='email'
                value={credentials.email}
                placeholder='work email'
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
            <button>Signup</button>
        </form>
        </div>

    )
}
