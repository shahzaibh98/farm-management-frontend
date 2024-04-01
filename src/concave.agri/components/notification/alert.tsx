import React, { useEffect, useState } from 'react';
import { Alert as MantineAlert } from '@mantine/core';

interface AlertProps {
  variant?: string;
  color?: string;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  [key: string]: any; // Allow rest props
}

const Alert = ({
  variant = 'light',
  color = 'blue',
  title,
  icon,
  children,
  ...rest
}: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Set visibility to false after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Clear the timeout when component unmounts
  }, []);

  return (
    <>
      {isVisible && ( // Render the alert only if it's visible
        <MantineAlert
          variant={variant}
          color={color}
          title={title}
          icon={icon}
          {...rest} // Spread rest props
        >
          {children}
        </MantineAlert>
      )}
    </>
  );
};

export default Alert;
