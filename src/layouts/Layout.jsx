import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Menu, X } from 'lucide-react';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle closing the menu
  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, [setMobileMenuOpen]);

  // Handle keyboard navigation, body overflow, and touch events
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Close mobile menu with Escape key
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMenu();
      }
    };

    // Handle touch start outside the menu
    const handleTouchStart = (e) => {
      // If menu is open and touch is outside the menu and button
      if (mobileMenuOpen) {
        const menuElement = document.getElementById('mobile-menu');
        const menuButton = document.querySelector('.mobile-menu-button');
        if (menuElement && 
            menuButton && 
            !menuElement.contains(e.target) && 
            !menuButton.contains(e.target)) {
          closeMenu();
        }
      }
    };

    // Control body overflow when menu is open
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileMenuOpen, closeMenu]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden"
            onClick={closeMenu}
            onTouchStart={(e) => {
              e.preventDefault();
              closeMenu();
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile menu button
      <button
        type="button"
        className="mobile-menu-button fixed top-4 right-4 z-50 p-2 rounded-md bg-white shadow-md lg:hidden keyboard-focus active:scale-95 transition-transform"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        onTouchStart={(e) => e.stopPropagation()}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-menu"
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button> */}

      {/* Header */}
      <header className="sticky top-0 z-20 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      </header>

      {/* Main content */}
      <motion.main
        className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;