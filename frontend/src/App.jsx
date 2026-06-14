// app.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { ProtectedRoute, PublicRoute } from './components/RouteGuards';
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import VerifyOtp from "./pages/auth/VerifyOtp"
import Splash from './pages/Splash';



function App() {
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



    </Routes>
   </BrowserRouter>
  );
}

export default App;
