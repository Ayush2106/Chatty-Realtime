import React, { useEffect } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import {Loader} from 'lucide-react'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SIgnupPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import Navbar  from './components/Navbar'
import {Toaster} from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'

const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const {theme} = useThemeStore()

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  console.log({authUser})
  console.log({onlineUsers})

  if(isCheckingAuth && !authUser)
    return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/>
    </div>
    )
  return (
    <div data-theme={theme}> 
     <Navbar/>
     <Routes>
      <Route path ="/" element={authUser ? <HomePage/> : <Navigate to = "/login" />}/>
      <Route path ="/signup" element={!authUser ? <SignupPage/>: <Navigate to= "/"/>}/>
      <Route path ="/login" element={!authUser? <LoginPage/> : <Navigate to= "/"/>}/>
      <Route path ="/settings" element={<SettingsPage/>}/>
      <Route path ="/profile" element={authUser ? <ProfilePage/> : <Navigate to = "/login" />}/>
     </Routes>

     <Toaster/>
    </div>
  )
}

export default App