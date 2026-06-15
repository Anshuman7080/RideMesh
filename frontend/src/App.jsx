// app.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import { ProtectedRoute, PublicRoute } from './components/RouteGuards';
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import VerifyOtp from "./pages/auth/VerifyOtp"
import Splash from './pages/Splash';
import {logout} from "./services/operations/authAPI"
import { getMyNotifications } from './services/operations/notificationAPI';

const RiderLayout=({children,activeTabId})=>{
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const {user,role}=useSelector((state)=>state.auth);
  const {unreadCount}=useSelector((state)=>state.notification);
  const [activeTab,setActiveTab]=useState(activeTabId || 'home');

useEffect(()=>{
  if(user){
    dispatch(getMyNotifications());
  }
},[dispatch,user]);

const handleTabChange=(id,path)=>{
  setActiveTab(id);
  navigate(path);
}

const handleLogout=()=>{
  dispatch(logout());
  navigate('/login');
}

return (
  <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
    <Navbar
      user={user}
      role={role}
      unreadNotificationsCount={unreadCount}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onLogout={handleLogout}
    />
    <main className="flex-1 flex flex-col">
      {children}
    </main>
  </div>
)

}


function App() {

   const { user } = useSelector((state) => state.auth);

  return (
   <BrowserRouter>
    <Routes>
        {/* public routes */}
          <Route
          path="/"
          element={
            <PublicRoute>
                <Splash/>
            </PublicRoute>
          }>
          </Route>

          <Route
          path="/login"
          element={
            <PublicRoute>
                <Login/>
            </PublicRoute>
          }>
          </Route>

          <Route
          path="/signup"
          element={
            <PublicRoute>
                <Signup/>
            </PublicRoute>
          }>
          </Route>

          <Route 
          path="/verify-otp"
          element={
            <PublicRoute>
                <VerifyOtp/>
            </PublicRoute>
          }>

          </Route>


          {/* routes for rider */}

          <Route
          path="/rider/home"
          element={
            <ProtectedRoute allowedRoles={['rider']}>
              <RiderLayout activeTabId="home">
               <RideHome
                 onSearchClick={() => window.location.href = '/rider/set-location'}
                  onApplyDriverClick={() => window.location.href = '/driver/apply'}
               />
              </RiderLayout>
            </ProtectedRoute>
          }/>

          



    </Routes>
   </BrowserRouter>
  );
}

export default App;
