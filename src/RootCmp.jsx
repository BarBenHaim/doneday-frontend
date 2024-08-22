import React from 'react'
import { Routes, Route, useLocation } from 'react-router'
import { HomePage } from './pages/HomePage'
import { AboutUs } from './pages/AboutUs'
import { UserDetails } from './pages/UserDetails'
import { AppHeader } from './cmps/AppHeader'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { Login } from './pages/Login.jsx'
import { Signup } from './pages/Signup.jsx'
import { BoardIndex } from './pages/BoardIndex.jsx'
import { BoardDetails } from './cmps/BoardDetails.jsx'
import { Sidebar } from './cmps/Sidebar.jsx'
import { RootActivityModal } from './cmps/group/task/RootActivityModal.jsx'

export function RootCmp() {
    const location = useLocation()
    const isHomePage = location.pathname === '/'

    return (
        <>
            <Routes>
                <Route path='/' element={<HomePage />} />
            </Routes>

            {!isHomePage && (
                <div className='main-container'>
                    <AppHeader />
                    <RootActivityModal />
                    <Sidebar />
                    <Routes>
                        <Route path='/about' element={<AboutUs />} />
                        <Route path='/board' element={<BoardIndex />} />
                        <Route path='/board/:boardId' element={<BoardDetails />} />
                        <Route path='/user/:id' element={<UserDetails />} />
                        <Route path='/login' element={<LoginSignup />}>
                            <Route index element={<Login />} />
                            <Route path='signup' element={<Signup />} />
                        </Route>
                    </Routes>
                </div>
            )}
        </>
    )
}
