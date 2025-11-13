import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // This ensures page scrolls to top smoothly or instantly
    window.scrollTo({
      top: 0,
      behavior: 'instant' // or 'smooth' if you want smooth scroll
    });
  }, [pathname]);

  return null; // this component doesn't render anything
}

export default ScrollToTop;
