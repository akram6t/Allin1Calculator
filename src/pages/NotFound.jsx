import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <motion.div 
      className="text-center py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 17,
              delay: 0.2
            }}
            className="inline-block"
          >
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <path d="M80 40H120V60H80V40Z" fill="#0EA5E9" />
              <path d="M80 80H120V100H80V80Z" fill="#0EA5E9" />
              <path d="M80 120H120V140H80V120Z" fill="#0EA5E9" />
              <text x="60" y="180" fontSize="40" fontWeight="bold" fill="#0EA5E9">404</text>
            </svg>
          </motion.div>
        </div>

        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="btn btn-primary flex items-center justify-center w-full sm:w-auto"
          >
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline flex items-center justify-center w-full sm:w-auto"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;