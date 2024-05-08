import React, { useEffect, useState } from 'react';
import { Notification as MantineNotification } from '@mantine/core';

interface NotificationProps {
  icon?: React.ReactNode;
  color?: string;
  title: string;
  children: React.ReactNode;
  handleCloseNotification: () => void;
  [key: string]: any; // Allow rest props
}

const Notification = ({
  icon,
  color,
  title,
  handleCloseNotification,
  children,
  ...rest
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleCloseNotification();
      setIsVisible(false); // Set visibility to false after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Clear the timeout when component unmounts
  }, []);

  const handleClose = () => {
    setIsVisible(false); // Close the notification manually
    handleCloseNotification();
  };

  return (
    <>
      {isVisible && (
        <>
          <div className="absolute left-1/2 min-w-[200px] transform -translate-x-1/2 transition ease-linear slide-in-out w-126 z-50 flex justify-start items-center font-light h-14 rounded mt-4">
            <MantineNotification
              styles={{ body: { minWidth: '300px' } }}
              title={title}
              icon={icon}
              color={color}
              withCloseButton
              onClose={handleClose}
              {...rest}
            >
              {children}
            </MantineNotification>
          </div>
        </>
      )}
    </>
  );
};

export default Notification;
