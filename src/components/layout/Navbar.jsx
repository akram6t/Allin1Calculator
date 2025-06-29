import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ChevronDown, BarChart3, RotateCw } from 'lucide-react';
import ThemeToggle from '../../lib/ThemeToggle';
import { Menu } from 'lucide-react';
import { X } from 'lucide-react';

const menuItems = [
  {
    path: '/basic',
    label: 'Basic',
    mobileLabel: 'Basic Calculator',
    icon: null
  },
  {
    path: '/scientific',
    label: 'Scientific',
    mobileLabel: 'Scientific Calculator',
    icon: null
  },
  {
    label: 'Financial',
    mobileLabel: 'Financial Calculators',
    icon: BarChart3,
    subItems: [
      {
        path: '/loan',
        label: 'Loan EMI Calculator'
      },
      {
        path: '/sip',
        label: 'SIP Calculator'
      },
      {
        path: '/tax',
        label: 'Tax Calculator'
      }
    ]
  },
  {
    label: 'Converters',
    mobileLabel: 'Converters',
    icon: RotateCw,
    subItems: [
      {
        path: '/length',
        label: 'Length Converter'
      },
      {
        path: '/weight',
        label: 'Weight Converter'
      },
      {
        path: '/temperature',
        label: 'Temperature Converter'
      },
      {
        path: '/currency',
        label: 'Currency Converter'
      }
    ]
  },
  {
    path: '/bmi',
    label: 'BMI Calculator',
    mobileLabel: 'BMI Calculator',
    icon: null
  }
];

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
    if (e) e.stopPropagation();

    if (window.innerWidth < 1024) {
      setDropdownOpen({
        ...dropdownOpen,
        [dropdown]: !dropdownOpen[dropdown]
      });
    } else {
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
      transition: {
        type: 'spring',
        ease: 'easeInOut',
        duration: 0.3
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        ease: 'easeInOut',
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  // Render desktop menu items
  const renderDesktopMenuItems = () => {
    return menuItems.map((item, index) => {
      if (item.path) {
        return (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `font-medium hover:text-primary-600 transition keyboard-focus ${isActive ? 'text-primary-600' : 'text-gray-700'}`
            }
          >
            {item.label}
          </NavLink>
        );
      } else if (item.subItems) {
        const dropdownKey = item.label.toLowerCase();
        return (
          <div key={index} className="relative">
            <button
              type="button"
              className="group flex items-center space-x-1 font-medium text-gray-700 hover:text-primary-600 transition keyboard-focus"
              onClick={(e) => toggleDropdown(dropdownKey, e)}
              aria-expanded={dropdownOpen[dropdownKey]}
              aria-haspopup="true"
            >
              <span>{item.label}</span>
              <ChevronDown
                size={16}
                className={`transition duration-200 ${dropdownOpen[dropdownKey] ? 'rotate-180 hover:text-blue-400 text-primary-600' : ''}`}
              />
            </button>

            {dropdownOpen[dropdownKey] && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 z-10 mt-2 w-48 rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5"
                onMouseLeave={() => setDropdownOpen({ ...dropdownOpen, [dropdownKey]: false })}
              >
                {item.subItems.map((subItem, subIndex) => (
                  <NavLink
                    key={subIndex}
                    to={subItem.path}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm ${isActive ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:text-blue-500'}`
                    }
                  >
                    {subItem.label}
                  </NavLink>
                ))}
              </motion.div>
            )}
          </div>
        );
      }
      return null;
    });
  };

  // Render mobile menu items
  const renderMobileMenuItems = () => {
    return menuItems.map((item, index) => {
      if (item.path) {
        return (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `block py-2 px-3 rounded-md ${isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-50'
              }`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.mobileLabel}
          </NavLink>
        );
      } else if (item.subItems) {
        const dropdownKey = item.label.toLowerCase();
        return (
          <div key={index} className="py-1">
            <button
              type="button"
              className="flex items-center justify-between w-full py-2 px-3 text-left text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              onClick={(e) => toggleDropdown(dropdownKey, e)}
            >
              <span className="flex items-center">
                {item.icon && <item.icon size={18} className="mr-2" />}
                <span>{item.mobileLabel}</span>
              </span>
              <ChevronDown
                size={16}
                className={`transition duration-200 ${dropdownOpen[dropdownKey] ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {dropdownOpen[dropdownKey] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="pl-8 mt-1 space-y-1"
              >
                {item.subItems.map((subItem, subIndex) => (
                  <NavLink
                    key={subIndex}
                    to={subItem.path}
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded-md ${isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {subItem.label}
                  </NavLink>
                ))}
              </motion.div>
            )}
          </div>
        );
      }
      return null;
    });
  };

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-primary-600 hover:text-black transition keyboard-focus"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Calculator size={28} />
          <span className="text-xl font-display font-bold">Allin1Calculator</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:space-x-8">
          {renderDesktopMenuItems()}
        </div>

        {/* Theme Toggle button */}
        <div className='hidden lg:block'>
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="mobile-menu-button z-50 p-2 rounded-md bg-white shadow-md lg:hidden keyboard-focus active:scale-95 transition-transform"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          onTouchStart={(e) => e.stopPropagation()}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 h-screen transition-opacity bg-black dark:bg-gray-100 opacity-50 lg:hidden ${mobileMenuOpen ? "block" : "hidden"}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        className={`fixed h-screen mobile-menu inset-y-0 left-0 z-30 w-72 overflow-y-auto transition duration-300 ease-in-out transform lg:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
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
            {renderMobileMenuItems()}

          </motion.div>

          {/* theme toggle button */}
          <div className='absolute bottom-3 right-3'>
            <ThemeToggle />
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;