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
import {logoutUser} from "./services/operations/authAPI"
import { getMyNotifications } from './services/operations/notificationAPI';
import RiderHome from './pages/rider/RiderHome';
import SetLocation from "./pages/rider/SetLocation"
import RideOptions from "./pages/rider/RideOptions";
import Searching from './pages/rider/Searching';
import LiveTracking from './pages/rider/LiveTracking';
import Completed from './pages/rider/Completed';
import PaymentFailure from './pages/rider/PaymentFailure';
import PaymentSuccess from './pages/rider/PaymentSuccess';
import RideHistory from './pages/rider/RideHistory';
import RideDetail from './pages/rider/RideDetail';
import RiderProfile from './pages/rider/RiderProfile';
import Notifications from './pages/rider/Notifications';

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
  dispatch(logoutUser());
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
            // <ProtectedRoute allowedRoles={['rider']}>
            //   <RiderLayout activeTabId="home">
               <RiderHome
                 onSearchClick={() => window.location.href = '/rider/set-location'}
                  onApplyDriverClick={() => window.location.href = '/driver/apply'}
               />
            //   </RiderLayout>
            // </ProtectedRoute>
          }/>

          <Route
          path="/rider/set-location"
          element={
            // <ProtectedRoute allowedRoles={['rider']}>
            //   <RiderLayout activeTabId="home">
                <SetLocation />
          //     </RiderLayout>
          // </ProtectedRoute>
          }
        />

     <Route
          path="/rider/ride-options"
          element={
            // <ProtectedRoute allowedRoles={['rider']}>
            //   <RiderLayout activeTabId="home">
                <RideOptions />
            //   </RiderLayout>
            // </ProtectedRoute>
          }
      />

       <Route
          path="/rider/searching"
          element={
            // <ProtectedRoute allowedRoles={['rider']}>
              <Searching />
            // </ProtectedRoute> 
          }
        />


       <Route
          path="/rider/tracking/:rideId"
          element={
            // <ProtectedRoute allowedRoles={['rider']}>
            //   <RiderLayout activeTabId="home">
                <LiveTracking />
            //   </RiderLayout>
            // </ProtectedRoute>
          }
        />


        <Route
          path="/rider/completed/:rideId"
          element={
            // <ProtectedRoute allowedRoles={['rider']}>
              <Completed />
            // </ProtectedRoute>
          }
        />

     {/* <Route
          path="/rider/payment/:rideId"
          element={
            <ProtectedRoute allowedRoles={['rider']}>
              <Payment />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/rider/payment/success"
          element={
            // <ProtectedRoute allowedRoles={['rider']}>
              <PaymentSuccess />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/rider/payment/failure"
          element={
            // <ProtectedRoute allowedRoles={['rider']}>
              <PaymentFailure />
            // </ProtectedRoute>
          }
        />
      
      <Route
          path="/rider/history"
          element={
            // <ProtectedRoute allowedRoles={['rider']}>
            //   <RiderLayout activeTabId="history">
                <RideHistory />
            //   </RiderLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/rider/history/:rideId"
          element={
            // <ProtectedRoute allowedRoles={['rider']}>
            //   <RiderLayout activeTabId="history">
                <RideDetail />
            //   </RiderLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/rider/profile"
          element={
            // <ProtectedRoute allowedRoles={['rider']}>
            //   <RiderLayout activeTabId="profile">
                <RiderProfile />
            //   </RiderLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/rider/notifications"
          element={
            // <ProtectedRoute allowedRoles={['rider']}>
            //   <RiderLayout activeTabId="notifications">
                <Notifications />
            //   </RiderLayout>
            // </ProtectedRoute>
          }
        />



    </Routes>
   </BrowserRouter>
  );
}

export default App;
