import React from 'react';
import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

export const ProtectedRoute=({children,allowedRoles})=>{
    const {token,user}=useSelector((state)=>state.auth);
    
    if(!token || !user){
        return <Navigate to="/login" replace/>
    }

    if(allowedRoles && !allowedRoles.includes(user.role)){
         const redirectPath=user.role==='driver' ? '/driver/home' : 'rider/home';
         
         return <Navigate to={redirectPath} replace></Navigate>
    }
    return children;
}


export const PublicRoute=({children})=>{
    const {token,user}=useSelector((state)=>state.auth);
    if(token && user){
        const redirectPath=user.role==='driver' ? '/driver/home' : '/rider/home';
        return <Navigate to={redirectPath} replace/>

    }

    return children;
}