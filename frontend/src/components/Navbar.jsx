import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Menu, X, Bell, User, LogOut, History, Shield, Car, Navigation } from 'lucide-react';

const Navbar = ({
  user,
  role = 'rider',
  onLogout,
  unreadNotificationsCount = 0,
  activeTab = '',
  onTabChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentRide } = useSelector((state) => state.ride);

  const navigationLinks = role === 'rider' 
    ? [
        { label: 'Book Ride', id: 'home', icon: MapPinIcon, path: '/rider/home' },
        { label: 'Activity', id: 'history', icon: History, path: '/rider/history' },
        { label: 'Notifications', id: 'notifications', icon: Bell, path: '/rider/notifications' },
        { label: 'Profile', id: 'profile', icon: User, path: '/rider/profile' },
        
      ]
    : [
        { label: 'Dashboard', id: 'dashboard', icon: Shield, path: '/driver/home' },
        { label: 'Ride Requests', id: 'requests', icon: Bell, path: '/driver/requests' },
        { label: 'Earnings', id: 'earnings', icon: History, path: '/driver/earnings' },
        { label: 'Profile', id: 'profile', icon: User, path: '/driver/profile' },
      ];

  const trackingPath = currentRide
    ? role === 'rider'
      ? `/rider/tracking/${currentRide._id || currentRide.rideId}`
      : `/driver/active/${currentRide._id || currentRide.rideId}`
    : null;

  function MapPinIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  }

  const handleLinkClick = (id, path) => {
    setIsMenuOpen(false);
    if (onTabChange) onTabChange(id, path);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-primary text-white border-b border-primary-light shadow-md h-16 flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-sans font-extrabold text-lg tracking-wider bg-white text-primary px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <span className="font-extrabold text-accent-blue">Ride</span>Mesh
          </span>
          {user && (
            <span className="hidden sm:inline-block ml-3 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-primary-light text-gray-300">
              {role}
            </span>
          )}
        </div>

        {/* Desktop Navigation */}
        {user && (
          <div className="hidden md:flex items-center gap-6">
            {navigationLinks.map((link) => {
              const LinkIcon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.path)}
                  className={`
                    relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all rounded-lg
                    ${isActive ? 'text-white bg-primary-light' : 'text-gray-400 hover:text-white hover:bg-primary-light/50'}
                  `}
                >
                  <LinkIcon size={16} />
                  {link.label}
                  {link.id === 'notifications' && unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-red text-[9px] font-bold text-white">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
              );
            })}

            {trackingPath && (
              <button
                onClick={() => handleLinkClick('tracking', trackingPath)}
                className="relative flex items-center gap-2 px-3.5 py-2 text-sm font-bold rounded-lg bg-accent-green/15 text-accent-green border border-accent-green/30 hover:bg-accent-green hover:text-white transition-all"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green" />
                </span>
                <Navigation size={15} />
                Track Live Ride
              </button>
            )}

            <div className="h-6 w-px bg-primary-light ml-2" />

            {/* User Profile Info & Logout */}
            <div className="flex items-center gap-3 ml-2">
              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold">{user.name}</span>
                <span className="text-[10px] text-gray-400">{user.email}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-accent-red hover:bg-primary-light rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Hamburger toggle */}
        {user && (
          <div className="flex items-center gap-3.5 md:hidden">
            {trackingPath && (
              <button
                onClick={() => handleLinkClick('tracking', trackingPath)}
                className="relative p-2 text-accent-green hover:text-white hover:bg-accent-green/20 rounded-lg transition-all"
                title="Track Live Ride"
              >
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green" />
                </span>
                <Navigation size={18} />
              </button>
            )}
            {role === 'rider' && unreadNotificationsCount > 0 && (
              <button
                onClick={() => handleLinkClick('notifications', '/rider/notifications')}
                className="relative p-2 text-gray-300 hover:text-white"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent-red text-[8px] font-bold text-white">
                  {unreadNotificationsCount}
                </span>
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-300 hover:text-white hover:bg-primary-light rounded-lg transition-all"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Side Drawer Menu */}
      <div
        className={`
          fixed top-16 bottom-0 right-0 w-[280px] bg-primary text-white border-l border-primary-light shadow-2xl z-50 md:hidden 
         h-screen transition-transform duration-300 transform flex flex-col justify-between
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Drawer Links */}
        <div className="px-4 py-6 space-y-2">
          {user && (
            <div className="flex items-center gap-3 px-3 pb-6 border-b border-primary-light mb-6">
              <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center font-bold text-white uppercase text-base border border-gray-700">
                {user.name ? user.name[0] : 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-[10px] text-gray-400">{user.email}</span>
              </div>
            </div>
          )}

          {trackingPath && (
            <button
              onClick={() => handleLinkClick('tracking', trackingPath)}
              className="flex w-full items-center gap-3.5 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all bg-accent-green/15 text-accent-green border border-accent-green/30 mb-2"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-green" />
              </span>
              <Navigation size={18} />
              <span className="flex-1 text-left">Track Live Ride</span>
            </button>
          )}

          {navigationLinks.map((link) => {
            const LinkIcon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.path)}
                className={`
                  flex w-full items-center gap-3.5 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all
                  ${isActive ? 'bg-white text-primary' : 'text-gray-300 hover:bg-primary-light'}
                `}
              >
                <LinkIcon size={18} />
                <span className="flex-1 text-left">{link.label}</span>
                {link.id === 'notifications' && unreadNotificationsCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-red text-[10px] font-bold text-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Drawer Footer Logout */}
        <div className="p-4 border-t border-primary-light mb-12">
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-3.5 px-4 py-3.5 text-sm font-semibold text-accent-red hover:bg-primary-light/50 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;