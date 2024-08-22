import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import { userService } from '../services/user'
import { login } from '../store/actions/user.actions'

export function Login() {
    const [users, setUsers] = useState([])
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [isManualEntry, setIsManualEntry] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        const users = await userService.getUsers()
        setUsers(users)
    }

    async function onLogin(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.email || !credentials.password) return
        await login(credentials)
        navigate('/board')
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    return (
        <section className='login-container'>
            <form className='login-form-monday' onSubmit={onLogin}>
                <h2>Login</h2>
                <select name='email' value={credentials.email} onChange={handleChange}>
                    <option value=''>Select Existing User</option>
                    {users.map(user => (
                        <option key={user._id} value={user.email}>
                            {user.fullname}
                        </option>
                    ))}
                </select>

                <input
                    type='email'
                    name='email'
                    value={credentials.email}
                    placeholder='Email'
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
                <button type='submit'>Login</button>
            </form>
        </section>
    )
}
