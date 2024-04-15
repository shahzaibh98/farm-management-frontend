import { useState, useEffect } from 'react';

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isSmallScreen: false,
    isMediumScreen: false,
    isLargeScreen: true,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isSmallScreen: window.innerWidth <= 600,
        isMediumScreen: window.innerWidth > 600 && window.innerWidth <= 768,
        isLargeScreen: window.innerWidth > 768,
      });
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
};

export default useScreenSize;
