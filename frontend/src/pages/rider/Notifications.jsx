import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, BellOff, Check, CheckSquare, Trash2, Calendar, MapPin, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { getMyNotifications, markRead, markAllRead } from '../../services/operations/notificationAPI';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';

const Notifications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notifications, unreadCount, loading, error } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(getMyNotifications());
  }, [dispatch]);

  const handleMarkRead = (id, isRead) => {
    if (!isRead) {
      dispatch(markRead(id));
    }
  };

  const handleMarkAllRead = () => {
    if (unreadCount > 0) {
      dispatch(markAllRead())
        .unwrap()
        .then(() => alert('All notifications marked as read'))
        .catch((err) => alert(err || 'Failed to update notifications'));
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

  const getIconForType = (type) => {
    switch (type?.toLowerCase()) {
      case 'ride_accepted':
      case 'driver_arrived':
      case 'ride_started':
      case 'ride_completed':
        return <CheckCircle2 className="text-accent-green" size={18} />;
      case 'ride_cancelled':
        return <AlertTriangle className="text-accent-red" size={18} />;
      case 'payment_success':
        return <CheckCircle2 className="text-accent-blue" size={18} />;
      case 'payment_failed':
        return <AlertCircle className="text-accent-red" size={18} />;
      default:
        return <Info className="text-gray-400" size={18} />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8 font-sans space-y-6">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/rider/home')}
            className="p-1.5 rounded-full hover:bg-gray-150 text-primary-darkgray hover:text-primary active:scale-90 transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-primary tracking-tight">Notifications</h1>
            <p className="text-xs text-primary-darkgray">
              You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}.
            </p>
          </div>
        </div>

     
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="border-gray-200 text-xs font-semibold py-2 px-3.5 flex items-center gap-1.5"
            icon={CheckSquare}
          >
            Mark all read
          </Button>
        )}
      </div>

     
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2.5 text-accent-red text-xs font-medium animate-fade-in">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      
      {loading && notifications.length === 0 ? (
        <Loader message="Loading notifications inbox..." />
      ) : notifications.length === 0 ? (
        <Card padding="spacious" className="text-center space-y-4 border-gray-150 shadow-sm bg-white py-12">
          <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto text-gray-400">
            <BellOff size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-primary">Inbox is clean</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Any alerts regarding active matches, payouts, and promos will appear here.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif._id}
              padding="normal"
              onClick={() => handleMarkRead(notif._id, notif.isRead)}
              className={`
                border-gray-150 transition-all shadow-sm flex gap-4 text-left cursor-pointer
                ${notif.isRead ? 'bg-white hover:border-gray-300' : 'bg-blue-50/20 border-blue-100 hover:border-blue-200'}
              `}
            >
              
              <div className={`
                h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border
                ${notif.isRead ? 'bg-gray-50 border-gray-100' : 'bg-blue-50 border-blue-100'}
              `}>
                {getIconForType(notif.type)}
              </div>

              
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className={`text-xs truncate ${notif.isRead ? 'font-bold text-primary' : 'font-extrabold text-blue-950'}`}>
                    {notif.title}
                  </h4>
                  {!notif.isRead && (
                    <span className="shrink-0 h-2 w-2 rounded-full bg-accent-blue animate-pulse mt-1" />
                  )}
                </div>
                
                <p className="text-[11px] text-primary-darkgray font-medium leading-relaxed">
                  {notif.message}
                </p>

                <div className="flex items-center gap-1.5 text-[9px] text-gray-400 pt-1.5 font-bold uppercase tracking-wider">
                  <Calendar size={11} />
                  <span>{formatDate(notif.createdAt)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
