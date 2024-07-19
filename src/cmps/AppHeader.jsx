import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import mondayLogoImg from '../assets/img/logo/monday-work-m-logo.png'
import logoImg from '../assets/img/logo/only-logo.png'


export function AppHeader() {
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()

    async function onLogout() {
        try {
            await logout()
            navigate('/')
            showSuccessMsg(`Bye now`)
        } catch (err) {
            showErrorMsg('Cannot logout')
        }
    }

    return (
        <header className='app-header full'>
            <nav>
                <div className="headline">
                <NavLink to='/board' className='logo'>
                <img src={logoImg} alt='logo' className="logo-img" />
                <div className="headline-text">
                <h1 className="componey-name fs16">Doneday</h1> 
                <h1 className="app-name fs18">Work managment</h1>
                </div>
  
                </NavLink>
                </div>
                <NavLink to='about'>About</NavLink>
                <NavLink to='board'>Boards</NavLink>
                <NavLink to='board/details'>Board Details</NavLink>
                <NavLink to='chat'>Chat</NavLink>
                <NavLink to='review'>Review</NavLink>

                {user?.isAdmin && <NavLink to='/admin'>Admin</NavLink>}

                {!user && (
                    <NavLink to='login' className='login-link'>
                        Login
                    </NavLink>
                )}
                {user && (
                    <div className='user-info'>
                        <Link to={`user/${user._id}`}>{user.fullname}</Link>
                        <button onClick={onLogout}>logout</button>
                    </div>
                )}
            </nav>
        </header>
    )
}
