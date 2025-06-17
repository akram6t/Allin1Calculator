import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, FileText, BarChart3, RotateCw, Activity } from 'lucide-react';

const Home = () => {
  // Track if user has scrolled for navbar styling
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Calculate card animation variants with staggered delay
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  // Feature cards data
  const calculatorCategories = [
    {
      title: 'Basic Calculator',
      description: 'Perform simple arithmetic operations with ease.',
      icon: <Calculator className="text-primary-500" size={24} />,
      to: '/basic',
      color: 'bg-blue-100'
    },
    {
      title: 'Scientific Calculator',
      description: 'Access advanced mathematical functions and operations.',
      icon: <FileText className="text-purple-500" size={24} />,
      to: '/scientific',
      color: 'bg-purple-100'
    },
    {
      title: 'Financial Calculators',
      description: 'Plan your finances with our range of financial tools.',
      icon: <BarChart3 className="text-green-500" size={24} />,
      to: '/loan',
      color: 'bg-green-100'
    },
    {
      title: 'Conversion Tools',
      description: 'Convert between different units of measurement.',
      icon: <RotateCw className="text-orange-500" size={24} />,
      to: '/length',
      color: 'bg-orange-100'
    },
    {
      title: 'BMI Calculator',
      description: 'Calculate and track your Body Mass Index.',
      icon: <Activity className="text-red-500" size={24} />,
      to: '/bmi',
      color: 'bg-red-100'
    }
  ];

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0  bg-gradient-to-br from-primary-300 to-secondary-500 opacity-50 rounded-3xl shadow-sm"></div>
        <div className="relative z-10 py-16 sm:py-24 px-4 sm:px-16 rounded-3xl overflow-hidden">
          <div className="relative z-10 text-center max-w-4xl px-20 sm:px-540 mx-auto ">
            <motion.h1
              className="text-4xl sm:text-5xl font-display font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Your Ultimate <span className="text-primary-600">Calculator</span>{" "}
              Toolkit
            </motion.h1>
            <motion.p
              className="text-xl text-gray-700 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              From basic arithmetic to advanced financial calculations,
              Allin1Calculator has all the tools you need in one place.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/basic"
                className="btn btn bg-primary-600  hover:bg-black hover:text-white text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
              >
                Get Started
              </Link>

              <Link
                to="/scientific"
                className="btn btn hover:bg-black hover:text-white text-black font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
              >
                Explore Calculators
              </Link>
            </motion.div>
          </div>

          {/* Floating calculator graphics */}
          <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-20 md:opacity-30">
            <motion.div
              animate={{
                rotate: [0, 5, 0, -5, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <svg
                width="300"
                height="300"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="30"
                  y="20"
                  width="140"
                  height="160"
                  rx="15"
                  fill="#0EA5E6"
                />
                <rect
                  x="45"
                  y="40"
                  width="110"
                  height="30"
                  rx="5"
                  fill="#F0F9FF"
                />
                <circle cx="60" cy="100" r="10" fill="#F0F9FF" />
                <circle cx="100" cy="100" r="10" fill="#F0F9FF" />
                <circle cx="140" cy="100" r="10" fill="#F0F9FF" />
                <circle cx="60" cy="135" r="10" fill="#F0F9FF" />
                <circle cx="100" cy="135" r="10" fill="#F0F9FF" />
                <circle cx="140" cy="135" r="10" fill="#F0F9FF" />
              </svg>
            </motion.div>
          </div>

          <div className="absolute left-0 bottom-0 translate-y-1/3 -translate-x-1/4 opacity-20 md:opacity-30">
            <motion.div
              animate={{
                rotate: [0, -5, 0, 5, 0],
                y: [0, 10, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <svg
                width="250"
                height="250"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="30"
                  y="20"
                  width="140"
                  height="160"
                  rx="15"
                  fill="#8B5CF6"
                />
                <rect
                  x="45"
                  y="40"
                  width="110"
                  height="30"
                  rx="5"
                  fill="#F5F3FF"
                />
                <circle cx="60" cy="100" r="10" fill="#F5F3FF" />
                <circle cx="100" cy="100" r="10" fill="#F5F3FF" />
                <circle cx="140" cy="100" r="10" fill="#F5F3FF" />
                <circle cx="60" cy="135" r="10" fill="#F5F3FF" />
                <circle cx="100" cy="135" r="10" fill="#F5F3FF" />
                <circle cx="140" cy="135" r="10" fill="#F5F3FF" />
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-display font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Explore Our Calculators
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We've got all the tools you need to make calculations quick and
            accurate.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {calculatorCategories.map((category, index) => (
            <motion.div
              key={index}
              className={`card p-6 ${category.color} border border-gray-100 hover:border-gray-200`}
              variants={item}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
            >
              <div className="mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <Link
                to={category.to}
                className="inline-flex items-center text-primary-600  hover:text-black font-medium"
              >
                Try it now
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-12 px-4 sm:px-8 rounded-2xl">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-display font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Using Allin1Calculator is simple, intuitive, and designed for
            everyone.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-700 text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose a Calculator</h3>
            <p className="text-gray-600">
              Select from our wide range of calculator tools based on your
              needs.
            </p>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-700 text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Enter Your Values</h3>
            <p className="text-gray-600">
              Input the required values for your calculation using our intuitive
              interface.
            </p>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-700 text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Instant Results</h3>
            <p className="text-gray-600">
              View your results instantly, with visualizations where applicable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Explore our calculator tools and make your calculations quick and
            easy.
          </p>
          <Link to="/basic" className="btn btn bg-primary-600  hover:bg-black hover:text-white text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
>
            Try Our Calculators
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;