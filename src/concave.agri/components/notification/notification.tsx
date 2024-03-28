import React, { useEffect, useState } from 'react';
import { Notification as MantineNotification } from '@mantine/core';

interface NotificationProps {
  icon?: React.ReactNode;
  color?: string;
  title: string;
  children: React.ReactNode;
  [key: string]: any; // Allow rest props
}

const Notification = ({
  icon,
  color,
  title,
  children,
  ...rest
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
      setIsVisible(false); // Set visibility to false after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Clear the timeout when component unmounts
  }, []);

  const handleClose = () => {
    setIsVisible(false); // Close the notification manually
    handleClose();
  };

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <MantineNotification
              className="w-96"
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
        </div>
      )}
    </>
  );
};

export default Notification;
