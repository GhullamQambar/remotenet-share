
import React, { useState, useEffect } from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

export const Notification: React.FC<NotificationProps> = ({ message, onClose, type = 'info' }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Allow for fade-out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  const bgColor = {
    success: 'bg-brand-green',
    error: 'bg-brand-red',
    info: 'bg-brand-accent',
  };

  return (
    <div className={`fixed top-5 right-5 transition-all duration-300 ease-in-out ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
      <div className={`${bgColor[type]} text-white font-bold rounded-lg shadow-lg py-3 px-5`}>
        {message}
      </div>
    </div>
  );
};