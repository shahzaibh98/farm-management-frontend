import { useState, useEffect } from 'react';

const useScreenSize = () => {
  // Initialize state with the current window dimensions and screen size categories
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isSmallScreen: window.innerWidth <= 600,
    isMediumScreen: window.innerWidth > 600 && window.innerWidth <= 768,
    isLargeScreen: window.innerWidth > 768,
  });

  // Effect hook to handle window resizing events
  useEffect(() => {
    // Function to update screen size state when the window is resized
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isSmallScreen: window.innerWidth <= 600,
        isMediumScreen: window.innerWidth > 600 && window.innerWidth <= 768,
        isLargeScreen: window.innerWidth > 768,
      });
    };

    // Add event listener for the 'resize' event
    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Return the current screen size information
  return screenSize;
};

export default useScreenSize;
