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
import DriverApply from './pages/driver/DriverApply';
import ApplySubmitted from './pages/driver/ApplySubmitted';
// import DriverHome from './pages/driver/DriverHome';
import DriverRequests from './pages/driver/DriverRequests';
import DriverCompleted from './pages/driver/DriverCompleted';
import DriverEarnings from './pages/driver/DriverEarnings';
import DriverProfile from "./pages/driver/DriverProfile"
import DriverHome from "./pages/driver/DriverHome"
import { SocketProvider } from './context/SocketProvider';

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

const DriverLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans">
      <nav className="h-16 bg-black border-b border-gray-900 flex items-center justify-between px-6">
        <span className="font-extrabold text-lg text-accent-blue tracking-wider">RideMesh Driver</span>
        <button 
          onClick={handleLogout}
          className="text-xs px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all active:scale-95"
        >
          Sign Out
        </button>
      </nav>
      <main className="flex-1 flex flex-col">
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
               <RiderHome
                 onSearchClick={() => window.location.href = '/rider/set-location'}
                  onApplyDriverClick={() => window.location.href = '/driver/apply'}
               />
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


        <Route
          path="/driver/apply"
          element={
            // <ProtectedRoute allowedRoles={['rider']}>
              <DriverApply />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/driver/apply/submitted"
          element={
            // <ProtectedRoute allowedRoles={['rider']}>
              <ApplySubmitted />
            // </ProtectedRoute>
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
            // <ProtectedRoute allowedRoles={['driver']}>
            //   <DriverLayout>
                <DriverRequests />
            //   </DriverLayout>
            // </ProtectedRoute>
          }
        />

{/* 
        <Route
          path="/driver/active/:rideId"
          element={
            // <ProtectedRoute allowedRoles={['driver']}>
            //   <DriverLayout>
                <ActiveRide />
            //   </DriverLayout>
            // </ProtectedRoute>
          }
        /> */}


         <Route
          path="/driver/completed"
          element={
            // <ProtectedRoute allowedRoles={['driver']}>
              <DriverCompleted />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/driver/earnings"
          element={
            // <ProtectedRoute allowedRoles={['driver']}>
            //   <DriverLayout>
                <DriverEarnings />
            //   </DriverLayout>
            // </ProtectedRoute>
          }
        />

        <Route
          path="/driver/profile"
          element={
            // <ProtectedRoute allowedRoles={['driver']}>
            //   <DriverLayout>
                <DriverProfile />
            //   </DriverLayout>
            // </ProtectedRoute>
          }
        />


 <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </SocketProvider>
   </BrowserRouter>
  );
}

export default App;
