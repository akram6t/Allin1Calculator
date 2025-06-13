import { Link } from 'react-router-dom';
import { Github, Heart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Calculators
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/basic" className="text-gray-600 hover:text-primary-600 transition">
                  Basic Calculator
                </Link>
              </li>
              <li>
                <Link to="/scientific" className="text-gray-600 hover:text-primary-600 transition">
                  Scientific Calculator
                </Link>
              </li>
              <li>
                <Link to="/loan" className="text-gray-600 hover:text-primary-600 transition">
                  Loan EMI Calculator
                </Link>
              </li>
              <li>
                <Link to="/sip" className="text-gray-600 hover:text-primary-600 transition">
                  SIP Calculator
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Converters Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Converters
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/length" className="text-gray-600 hover:text-primary-600 transition">
                  Length Converter
                </Link>
              </li>
              <li>
                <Link to="/weight" className="text-gray-600 hover:text-primary-600 transition">
                  Weight Converter
                </Link>
              </li>
              <li>
                <Link to="/temperature" className="text-gray-600 hover:text-primary-600 transition">
                  Temperature Converter
                </Link>
              </li>
              <li>
                <Link to="/bmi" className="text-gray-600 hover:text-primary-600 transition">
                  BMI Calculator
                </Link>
              </li>
            </ul>
          </div>
          
          {/* About Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              About
            </h3>
            <p className="text-gray-600 mb-4">
              Allin1Calculator is a comprehensive web-based calculator platform offering a wide range of tools for various calculations and conversions.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">GitHub</span>
                <Github size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-500 hover:text-gray-700 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">External Link</span>
                <ExternalLink size={20} />
              </motion.a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Allin1Calculator. All rights reserved.
          </p>
          <p className="flex items-center text-gray-500 text-sm mt-4 md:mt-0">
            Made with <Heart className="mx-1 text-red-500" size={16} /> for developers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;