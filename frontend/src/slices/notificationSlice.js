import {createSlice} from "@reduxjs/toolkit";

const initialState={
    notifications:[],
    unreadCount:0,
    loading:false,
    error:null,
};

const notificationSlice=createSlice({
    name:"notification",
    initialState,
    
    reducers:{
        setLoading:(state,action)=>{
            state.loading=action.payload;
        },
        setError:(state,action)=>{
            state.error=action.payload;
        },
        setNotifications:(state,action)=>{
            state.notifications=action.payload;
            state.unreadCount=action.payload.filter(
                (n)=>!n.isRead
            ).length;

        },
        markNotificationRead:(state,action)=>{
            const notificationId=action.payload;
            const notification=state.notifications.find(
                (n)=>n/_id===notificationId
            )

            if(notification && !notification.isRead){
                notification.isRead=true;
                state.unreadCount=Math.max(
                    0,
                    state.unreadCount-1
                );
            }
        },
        markAllNotificationsRead:(state)=>{
            state.notifications.forEach((notification)=>{
                notification.isRead=true;
            });
            state.unreadCount=0;
        },
        addNotification:(state,action)=>{
            state.notifications.unshift(action.payload);
            if(!action.payload.isRead){
                state.unreadCount+=1;
            }
        },
        clearNotificationState:(state)=>{
            state.notifications=[];
            state.unreadCount=0;
            state.error=null;
        },
        
    },
})


export const {
  setLoading,
  setError,
  setNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  addNotification,
  clearNotificationState,
} = notificationSlice.actions;

export default notificationSlice.reducer;