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
import PaymentSuccess from './pages/rider/PaymentSuccess';
import RideHistory from './pages/rider/RideHistory';
import RideDetail from './pages/rider/RideDetail';
import RiderProfile from './pages/rider/RiderProfile';
import Notifications from './pages/rider/Notifications';
import DriverApply from './pages/driver/DriverApply';
import ApplySubmitted from './pages/driver/ApplySubmitted';
// import DriverHome from './pages/driver/DriverHome';
import DriverRequests from './pages/driver/DriverRequests';
import DriverCompleted from './pages/driver/DriverCompleted';
import DriverEarnings from './pages/driver/DriverEarnings';
import DriverProfile from "./pages/driver/DriverProfile"
import DriverHome from "./pages/driver/DriverHome"
import ActiveRide from './pages/driver/ActiveRide';
import { SocketProvider } from './context/SocketProvider';
import { ToastContainer } from "react-toastify";
import { useSocket } from './context/SocketProvider';
import { getActiveRide } from './services/operations/rideAPI';
import { getDriverProfile } from './services/operations/driverAPI';
import { getRiderProfile } from './services/operations/riderAPI';

const RiderLayout=({children,activeTabId})=>{
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const {user,role,token}=useSelector((state)=>state.auth);
  const {unreadCount}=useSelector((state)=>state.notification);
  const [activeTab,setActiveTab]=useState(activeTabId || 'home');

useEffect(()=>{
  if(user){
    dispatch(getMyNotifications({token}));
  }
},[dispatch,user]);

const handleTabChange=(id,path)=>{
  setActiveTab(id);
  navigate(path);
}

useEffect(()=>{
  if(user){
    dispatch(getActiveRide({token}))
  }
},[])

useEffect(()=>{
  if(user){
    dispatch(getRiderProfile({token}));
  }
},[])

const handleLogout=()=>{
  dispatch(logoutUser());
  navigate('/login');
}

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col font-sans">
    <div className="bg-gradient-to-r from-slate-900/95 via-indigo-950/95 to-slate-900/95 backdrop-blur-md border-b border-indigo-500/20 shadow-lg shadow-indigo-950/50 relative z-10">
      <Navbar
        user={user}
        role={role}
        unreadNotificationsCount={unreadCount}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />
    </div>
    <main className="flex-1 flex flex-col bg-slate-50 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.3)] relative z-0">
      {children}
    </main>
  </div>
)

}


const DriverLayout = ({ children,activeTabId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {currentRide}=useSelector((state)=>state.ride);
  const {socket}=useSocket();
  console.log("currenRide on driver layout",currentRide);

   const {user,role,token}=useSelector((state)=>state.auth);
  const {unreadCount}=useSelector((state)=>state.notification);
  const [activeTab,setActiveTab]=useState(activeTabId || 'dashboard');
  
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };


//   useEffect(()=>{
//   if(user){
//     dispatch(getMyNotifications());
//   }
// },[dispatch,user]);

useEffect(()=>{
  if(user){
    dispatch(getActiveRide({token}))
  }
},[])

useEffect(()=>{
  if(user){
    dispatch(getDriverProfile({token}));
  }
},[])

const handleTabChange=(id,path)=>{
  setActiveTab(id);
  navigate(path);
}

  useEffect(()=>{
    if(!socket || !currentRide?.riderId)return;

    console.log('[Driver] Ride tracking started');

    const watchId=navigator.geolocation.watchPosition((pos)=>{
      socket.emit('location-update-forRide',{
        riderId:currentRide.riderId,
        latitude:pos.coords.latitude,
        longitude:pos.coords.longitude,
      });
    })
    return ()=>{
      navigator.geolocation.clearWatch(watchId);
    };
  },[socket,currentRide?.riderId]);

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col font-sans">
    <div className="bg-gradient-to-r from-slate-900/95 via-indigo-950/95 to-slate-900/95 backdrop-blur-md border-b border-indigo-500/20 shadow-lg shadow-indigo-950/50 relative z-10">
      <Navbar
        user={user}
        role={role}
        unreadNotificationsCount={unreadCount}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />
    </div>
    <main className="flex-1 flex flex-col bg-slate-50 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.3)] relative z-0">
      {children}
    </main>
  </div>
  );
};



function App() {

   const { user } = useSelector((state) => state.auth);


  return (
   <BrowserRouter>
   <SocketProvider>
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
               <RiderHome/>
               </RiderLayout>
             </ProtectedRoute>
          }/>

          <Route
          path="/rider/set-location"
          element={
            <ProtectedRoute allowedRoles={['rider']}>
              <RiderLayout activeTabId="home">
                <SetLocation />
               </RiderLayout>
           </ProtectedRoute>
          }
        />

     <Route
          path="/rider/ride-options"
          element={
            <ProtectedRoute allowedRoles={['rider']}>
              <RiderLayout activeTabId="home">
                <RideOptions />
             </RiderLayout>
             </ProtectedRoute>
          }
      />

       <Route
          path="/rider/searching"
          element={
             <ProtectedRoute allowedRoles={['rider']}>
              <Searching />
           </ProtectedRoute> 
          }
        />


       <Route
          path="/rider/tracking/:rideId"
          element={
            <ProtectedRoute allowedRoles={['rider']}>
              <RiderLayout activeTabId="home">
                <LiveTracking />
               </RiderLayout>
             </ProtectedRoute>
          }
        />


        <Route
          path="/rider/completed/:rideId"
          element={
            <ProtectedRoute allowedRoles={['rider']}>
            <RiderLayout>
              <Completed />
              </RiderLayout>
            </ProtectedRoute>
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
            <ProtectedRoute allowedRoles={['rider']}>
              <PaymentSuccess />
             </ProtectedRoute>
          }
        />
      
      <Route
          path="/rider/history"
          element={
            <ProtectedRoute allowedRoles={['rider']}>
              <RiderLayout activeTabId="history">
                <RideHistory />
              </RiderLayout>
           </ProtectedRoute>
          }
        />
        <Route
          path="/rider/history/:rideId"
          element={
            <ProtectedRoute allowedRoles={['rider']}>
              <RiderLayout activeTabId="history">
                <RideDetail />
              </RiderLayout>
             </ProtectedRoute>
          }
        />
        <Route
          path="/rider/profile"
          element={
            <ProtectedRoute allowedRoles={['rider']}>
              <RiderLayout activeTabId="profile">
                <RiderProfile />
              </RiderLayout>
             </ProtectedRoute>
          }
        />
        <Route
          path="/rider/notifications"
          element={
            <ProtectedRoute allowedRoles={['rider']}>
              <RiderLayout activeTabId="notifications">
                <Notifications />
               </RiderLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/driver/apply"
          element={
            <ProtectedRoute allowedRoles={['rider']}>
            <RiderLayout >
              <DriverApply />
              </RiderLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/apply/submitted"
          element={
            <ProtectedRoute allowedRoles={['rider']}>
              <ApplySubmitted />
             </ProtectedRoute>
          }
        />

       <Route
          path="/driver/home"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverLayout>
                <DriverHome />
               </DriverLayout>
             </ProtectedRoute>
          }
        />
      
       <Route
          path="/driver/requests"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverLayout activeTabId="requests">
                <DriverRequests />
              </DriverLayout>
           </ProtectedRoute>
          }
        />


        <Route
          path="/driver/active/:rideId"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverLayout activeTabId="dashboard">
                <ActiveRide />
               </DriverLayout>
             </ProtectedRoute>
          }
        />


         <Route
          path="/driver/completed/:rideId"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
            <DriverLayout>
              <DriverCompleted />
              </DriverLayout>
             </ProtectedRoute>
          }
        />

        <Route
          path="/driver/earnings"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverLayout activeTabId="earnings">
                <DriverEarnings />
               </DriverLayout>
             </ProtectedRoute>
          }
        />

        <Route
          path="/driver/profile"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverLayout activeTabId="profile">
                <DriverProfile />
               </DriverLayout>
            </ProtectedRoute>
          }
        />


 <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <ToastContainer />
  </SocketProvider>
   </BrowserRouter>
  );
}

export default App;
