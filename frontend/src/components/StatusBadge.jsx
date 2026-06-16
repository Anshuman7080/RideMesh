import React from 'react';

const StatusBadge = ({
  status,
  className = ''
}) => {
  const normalizedStatus = (status || '').toUpperCase();

  const statuses = {
    // Ride statuses
    REQUESTED: {
      label: 'Requested',
      classes: 'bg-blue-50 text-accent-blue border-blue-100',
    },
    ACCEPTED: {
      label: 'Accepted',
      classes: 'bg-purple-50 text-purple-700 border-purple-100',
    },
    DRIVER_ARRIVED: {
      label: 'Driver Arrived',
      classes: 'bg-indigo-50 text-indigo-700 border-indigo-100 animate-pulse',
    },
    IN_PROGRESS: {
      label: 'On Trip',
      classes: 'bg-amber-50 text-amber-700 border-amber-100',
    },
    COMPLETED: {
      label: 'Completed',
      classes: 'bg-green-50 text-accent-green border-green-100',
    },
    CANCELLED: {
      label: 'Cancelled',
      classes: 'bg-red-50 text-accent-red border-red-100',
    },

    // Driver availability / application statuses
    ONLINE: {
      label: 'Online',
      classes: 'bg-green-50 text-accent-green border-green-100',
    },
    OFFLINE: {
      label: 'Offline',
      classes: 'bg-gray-100 text-gray-500 border-gray-200',
    },
    APPROVED: {
      label: 'Approved',
      classes: 'bg-green-50 text-accent-green border-green-100',
    },
    PENDING: {
      label: 'Pending Review',
      classes: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    },
    REJECTED: {
      label: 'Rejected',
      classes: 'bg-red-50 text-accent-red border-red-100',
    },
  };

  const config = statuses[normalizedStatus] || {
    label: status,
    classes: 'bg-gray-50 text-gray-700 border-gray-100',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border
        ${config.classes} ${className}
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
