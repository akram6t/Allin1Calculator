import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ChevronDown, BarChart3, RotateCw } from 'lucide-react';

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState({
    financial: false,
    converters: false
  });
  
  // Handle keyboard navigation for dropdowns
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen({
          financial: false,
          converters: false
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toggle dropdown state
  const toggleDropdown = (dropdown, e) => {
    // Prevent event from bubbling up to parent elements
    if (e) {
      e.stopPropagation();
    }
    
    // On mobile, don't close other dropdowns
    if (window.innerWidth < 1024) {
      setDropdownOpen({
        ...dropdownOpen,
        [dropdown]: !dropdownOpen[dropdown]
      });
    } else {
      // On desktop, close other dropdowns
      const newState = {
        financial: false,
        converters: false
      };
      newState[dropdown] = !dropdownOpen[dropdown];
      setDropdownOpen(newState);
    }
  };

  // Mobile menu animation variants
  const mobileMenuVariants = {
    closed: {
      x: '100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    }
  };

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition keyboard-focus"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Calculator size={28} />
          <span className="text-xl font-display font-bold">Allin1Calculator</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:space-x-8">
          <NavLink 
            to="/basic" 
            className={({ isActive }) => 
              `font-medium hover:text-primary-600 transition keyboard-focus ${isActive ? 'text-primary-600' : 'text-gray-700'}`
            }
          >
            Basic
          </NavLink>
          
          <NavLink 
            to="/scientific" 
            className={({ isActive }) => 
              `font-medium hover:text-primary-600 transition keyboard-focus ${isActive ? 'text-primary-600' : 'text-gray-700'}`
            }
          >
            Scientific
          </NavLink>
          
          {/* Financial Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="group flex items-center space-x-1 font-medium text-gray-700 hover:text-primary-600 transition keyboard-focus"
              onClick={(e) => toggleDropdown('financial', e)}
              aria-expanded={dropdownOpen.financial}
              aria-haspopup="true"
            >
              <span>Financial</span>
              <ChevronDown 
                size={16} 
                className={`transition duration-200 ${dropdownOpen.financial ? 'rotate-180 text-primary-600' : ''}`} 
              />
            </button>
            
            {dropdownOpen.financial && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 z-10 mt-2 w-48 rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5"
                onMouseLeave={() => setDropdownOpen({...dropdownOpen, financial: false})}
              >
                <NavLink
                  to="/loan"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${isActive ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`
                  }
                >
                  Loan EMI Calculator
                </NavLink>
                <NavLink
                  to="/sip"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${isActive ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`
                  }
                >
                  SIP Calculator
                </NavLink>
                <NavLink
                  to="/tax"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${isActive ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`
                  }
                >
                  Tax Calculator
                </NavLink>
              </motion.div>
            )}
          </div>
          
          {/* Converters Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="group flex items-center space-x-1 font-medium text-gray-700 hover:text-primary-600 transition keyboard-focus"
              onClick={(e) => toggleDropdown('converters', e)}
              aria-expanded={dropdownOpen.converters}
              aria-haspopup="true"
            >
              <span>Converters</span>
              <ChevronDown 
                size={16} 
                className={`transition duration-200 ${dropdownOpen.converters ? 'rotate-180 text-primary-600' : ''}`} 
              />
            </button>
            
            {dropdownOpen.converters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 z-10 mt-2 w-48 rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5"
                onMouseLeave={() => setDropdownOpen({...dropdownOpen, converters: false})}
              >
                <NavLink
                  to="/length"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${isActive ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`
                  }
                >
                  Length Converter
                </NavLink>
                <NavLink
                  to="/weight"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${isActive ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`
                  }
                >
                  Weight Converter
                </NavLink>
                <NavLink
                  to="/temperature"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${isActive ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`
                  }
                >
                  Temperature Converter
                </NavLink>
                <NavLink
                  to="/currency"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${isActive ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`
                  }
                >
                  Currency Converter
                </NavLink>
              </motion.div>
            )}
          </div>
          
          <NavLink 
            to="/bmi" 
            className={({ isActive }) => 
              `font-medium hover:text-primary-600 transition keyboard-focus ${isActive ? 'text-primary-600' : 'text-gray-700'}`
            }
          >
            BMI Calculator
          </NavLink>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu lg:hidden"
            variants={mobileMenuVariants}
            initial="closed"
            animate={mobileMenuOpen ? "open" : "closed"}
            exit="closed"
          >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Calculator size={24} />
              <span className="text-lg font-display font-bold">Allin1Calculator</span>
            </Link>
          </div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <NavLink
              to="/basic"
              className={({ isActive }) =>
                `block py-2 px-3 rounded-md ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Basic Calculator
            </NavLink>
            
            <NavLink
              to="/scientific"
              className={({ isActive }) =>
                `block py-2 px-3 rounded-md ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Scientific Calculator
            </NavLink>

            {/* Financial Calculators Section */}
            <div className="py-1">
              <button
                type="button"
                className="flex items-center justify-between w-full py-2 px-3 text-left text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                onClick={(e) => toggleDropdown('financial', e)}
              >
                <span className="flex items-center">
                  <BarChart3 size={18} className="mr-2" />
                  <span>Financial Calculators</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`transition duration-200 ${
                    dropdownOpen.financial ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {dropdownOpen.financial && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="pl-8 mt-1 space-y-1"
                >
                  <NavLink
                    to="/loan"
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded-md ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Loan EMI Calculator
                  </NavLink>
                  <NavLink
                    to="/sip"
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded-md ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    SIP Calculator
                  </NavLink>
                  <NavLink
                    to="/tax"
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded-md ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tax Calculator
                  </NavLink>
                </motion.div>
              )}
            </div>

            {/* Converters Section */}
            <div className="py-1">
              <button
                type="button"
                className="flex items-center justify-between w-full py-2 px-3 text-left text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                onClick={(e) => toggleDropdown('converters', e)}
              >
                <span className="flex items-center">
                  <RotateCw size={18} className="mr-2" />
                  <span>Converters</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`transition duration-200 ${
                    dropdownOpen.converters ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {dropdownOpen.converters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="pl-8 mt-1 space-y-1"
                >
                  <NavLink
                    to="/length"
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded-md ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Length Converter
                  </NavLink>
                  <NavLink
                    to="/weight"
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded-md ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Weight Converter
                  </NavLink>
                  <NavLink
                    to="/temperature"
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded-md ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Temperature Converter
                  </NavLink>
                  <NavLink
                    to="/currency"
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded-md ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Currency Converter
                  </NavLink>
                </motion.div>
              )}
            </div>

            <NavLink
              to="/bmi"
              className={({ isActive }) =>
                `block py-2 px-3 rounded-md ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              BMI Calculator
            </NavLink>
          </motion.div>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;