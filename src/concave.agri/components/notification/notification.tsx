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
      setIsVisible(false); // Set visibility to false after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Clear the timeout when component unmounts
  }, []);

  const handleClose = () => {
    setIsVisible(false); // Close the notification manually
  };

  return (
    <>
      {isVisible && ( // Render the notification only if it's visible
        <MantineNotification
          title={title}
          icon={icon}
          color={color}
          withCloseButton
          onClose={handleClose} // Call handleClose when close button is clicked
          {...rest} // Spread rest props
        >
          {children}
        </MantineNotification>
      )}
    </>
  );
};

export default Notification;
