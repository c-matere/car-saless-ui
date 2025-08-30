import React, { useState, useCallback, memo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

// Intersection Observer for lazy loading
const useIntersectionObserver = (ref, options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return { isVisible, hasRendered };
};

// Memoized components
const ControlButton = memo(({ button, onClick }) => {
  const isDarkButton = button.id === 4; // This is the contact button
  return (
    <motion.div 
      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border border-[#4a4a4a] ${
        isDarkButton 
          ? 'bg-[#2f2f2f] hover:bg-[#3e3e3e] text-white' 
          : 'bg-[#2f2f2f] hover:bg-[#3e3e3e] text-white'
      }`}
      onClick={() => onClick(button.id)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center justify-center">
        {button.icon}
      </div>
    </motion.div>
  );
});

// Error boundary for 3D model
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] rounded-2xl">
          <div className="text-gray-400">3D model failed to load</div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy load the 3D model with no SSR and better loading state
const CarModel = dynamic(
  () => import('./CarModel').then(mod => {
    // Preload the model if possible
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'fetch';
      link.href = '/free_1972_datsun_240k_gt.glb';
      document.head.appendChild(link);
    }
    return mod;
  }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] rounded-2xl">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-[#ffb600] border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="text-sm text-gray-400">Loading 3D model...</span>
        </div>
      </div>
    )
  }
);

// Icons as separate components
const ArrowLeft = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

const ArrowRight = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

const ArrowUp = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

const ContactIcon = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7117 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0034 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92173 4.44061 8.37483 5.27072 7.03245C6.10083 5.69007 7.28835 4.60545 8.7 3.89995C9.87812 3.30488 11.1801 2.99651 12.5 2.99995H13C15.0843 3.1149 17.053 3.98875 18.5291 5.4708C20.0052 6.95284 20.8744 8.9281 21 11.025V11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

// Navigation items
const navigationItems = [
  { id: 1, label: "HOME", active: true },
  { id: 2, label: "About us", active: false },
  { id: 3, label: "BLOG", active: false },
  { id: 4, label: "CONTACT", active: false },
  { id: 5, label: "SHOP", active: false },
];

// Control buttons
const controlButtons = [
  { id: 1, icon: <ArrowLeft /> },
  { id: 2, icon: <ArrowRight /> },
  { id: 3, icon: <ArrowUp /> },
  { id: 4, icon: <ContactIcon /> },
];

const LaptopView = ({ onExploreCars }) => {
  const [activeNav, setActiveNav] = useState("HOME");
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic will go here
    console.log('Form submitted:', formData);
    setIsContactOpen(false);
  };
  
  // Memoize models array
  const models = React.useMemo(() => [
    { name: 'Datsun 240K GT', path: '/free_1972_datsun_240k_gt.glb' },
    { name: 'Lamborghini Urus', path: '/urus_absoluttm.glb' }
  ], []);

  // Memoize handlers
  const handleNavClick = useCallback((label) => {
    setActiveNav(label);
  }, []);

  const handleNextModel = useCallback(() => {
    setCurrentModelIndex(prev => (prev + 1) % models.length);
  }, [models.length]);

  const handlePrevModel = useCallback(() => {
    setCurrentModelIndex(prev => (prev - 1 + models.length) % models.length);
  }, [models.length]);

  const handleControlButtonClick = useCallback((id) => {
    // Handle control button clicks
    if (id === 3) {
      // Handle up arrow
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 4) {
      // Toggle contact form
      setIsContactOpen(true);
    }
  }, [onExploreCars]);

  return (
    <motion.main 
      className="bg-[#1d1d1d] min-h-screen w-full overflow-x-hidden" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      {/* Navigation */}
      <motion.nav 
        className="w-full px-4 sm:px-6 lg:px-8 py-3 md:py-4 fixed top-0 left-0 right-0 bg-[#1d1d1d]/95 backdrop-blur-sm z-40 border-b border-[#2e2e2e]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl md:text-2xl font-bold">CAR YARD</h1>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 bg-[#2e2e2e73] rounded-[31px] border-2 border-solid border-[#2e2e2e] p-1 backdrop-blur-sm">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="hidden md:block">
            <button
              onClick={() => handleControlButtonClick(4)}
              className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition-colors text-sm md:text-base"
            >
              CONTACT US
            </button>
          </div>
        </div>
      </motion.nav>

      <div className="bg-[#1d1d1d] overflow-hidden w-full relative pt-28 md:pt-24 lg:pt-12">
        {/* Main Content Section */}
        <motion.div 
          className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Heading */}
          <motion.div className="mb-8 md:mb-12 mt-10 md:mt-6 lg:mt-2">
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-['Montserrat'] leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="block sm:inline"
              >FIND</motion.span>
              <motion.span 
                className="text-[#ffb600] block sm:inline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              > A CAR FOR SALE</motion.span>
              <motion.span 
                className="block sm:inline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              > IN MOMBASA, FAST, RELIABLE AND EASY</motion.span>
            </motion.h2>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
          >
            {/* Left Column - Description */}
            <motion.div className="space-y-8">
              <motion.article 
                className="p-4 sm:p-6 rounded-2xl border-2 border-solid border-[#2e2e2e] bg-[#2f2f2f] backdrop-blur-sm"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.99 }}
              >
                <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed">
                  Finding cars for sale in Kenya has never been easier. Whether you're searching for a luxury car, a budget-friendly hatchback, a spacious SUV, a fuel-efficient sedan, or a tough pickup truck, the Kenyan car market offers something for everyone.
                </p>
              </motion.article>

              {/* Specifications */}
              <motion.div 
                className="p-4 sm:p-6 bg-[#2e2e2e73] rounded-2xl border-2 border-solid border-[#2e2e2e] backdrop-blur-sm"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.99 }}
              >
                <h3 className="text-white text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                  {[
                    "Model: Lamborghini Urus",
                    "Type: Super SUV",
                    "Engine: 4.0-liter twin-turbocharged V8",
                    "Power: ~657 hp (490 kW)",
                    "Torque: 850 Nm (627 lb-ft)",
                    "Transmission: 8-speed automatic",
                    "Drivetrain: All-wheel drive (AWD)",
                  ].map((spec, index) => (
                    <div key={index} className="text-white text-sm sm:text-base leading-relaxed">
                      {spec}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <motion.button
                  onClick={() => handleControlButtonClick(4)}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-black text-base sm:text-xl font-semibold rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all w-full sm:w-auto text-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  BUY NOW
                </motion.button>
                <motion.button
                  onClick={onExploreCars}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white text-base sm:text-xl font-semibold rounded-full border-2 border-white hover:bg-white/10 active:bg-white/20 transition-all w-full sm:w-auto text-center relative overflow-hidden"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">EXPLORE CARS</span>
                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 -mt-1.25 -ml-1.25 bg-black rounded-full" />
                  </div>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Column - Car Image */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative h-full">
                <div className="sticky top-24 md:top-8">
                  <Suspense fallback={
                    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gray-900 rounded-2xl md:rounded-3xl animate-pulse" />
                  }>
                    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden">
                      <CarModel modelPath={models[currentModelIndex].path} />
                    </div>
                  </Suspense>
                  
                  {/* Control Buttons */}
                  <div className="absolute bottom-4 right-4 md:right-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-1/2 flex md:flex-col gap-3 p-2 md:p-3 border md:border-2 border-[#808080] rounded-3xl md:rounded-[56px] bg-[#2f2f2f] backdrop-blur-sm">
                    {/* Left Arrow */}
                    <motion.div 
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center cursor-pointer bg-[#2f2f2f] hover:bg-[#3e3e3e] text-white border border-[#4a4a4a]"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePrevModel}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </motion.div>

                    {/* Right Arrow */}
                    <motion.div 
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center cursor-pointer bg-[#2f2f2f] hover:bg-[#3e3e3e] text-white border border-[#4a4a4a]"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextModel}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </motion.div>

                    {/* Other control buttons */}
                    {controlButtons.slice(2).map((button) => (
                      <ControlButton 
                        key={button.id} 
                        button={button} 
                        onClick={handleControlButtonClick} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Down Indicator - Only show on larger screens */}
        <motion.div 
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex-col items-center justify-center z-10 hidden md:flex"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            y: [20, 0, -10, -20]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <span className="text-white text-xs sm:text-sm mb-2 font-mono">Scroll Down</span>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path 
              d="M7 10L12 15L17 10" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Back to top button - Mobile */}
        <motion.button
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#ffb600] rounded-full flex items-center justify-center shadow-lg z-20"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 15L12 9L6 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>

      </div>

      {/* Featured Vehicles Section */}
      <section className="py-16 bg-[#1d1d1d] border-t border-[#2e2e2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Featured Vehicles</h2>
            <div className="w-20 h-1 bg-[#ffb600] mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                name: 'Lamborghini Urus',
                price: '$218,009',
                image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                specs: ['4.0L V8', '641 HP', '0-60 mph: 3.1s', 'Top Speed: 190 mph']
              },
              {
                id: 2,
                name: 'Porsche 911 Turbo S',
                price: '$207,000',
                image: 'https://images.unsplash.com/photo-1583121274602-3e2820c6988f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                specs: ['3.7L Flat-6', '640 HP', '0-60 mph: 2.6s', 'Top Speed: 205 mph']
              },
              {
                id: 3,
                name: 'Mercedes-AMG GT',
                price: '$138,650',
                image: 'https://images.unsplash.com/photo-1619682815201-471da54f0bc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
                specs: ['4.0L V8', '523 HP', '0-60 mph: 3.8s', 'Top Speed: 194 mph']
              },
              {
                id: 4,
                name: 'Audi R8 V10',
                price: '$148,700',
                image: 'https://images.unsplash.com/photo-1619682815201-471da54f0bc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
                specs: ['5.2L V10', '562 HP', '0-60 mph: 3.6s', 'Top Speed: 205 mph']
              },
              {
                id: 5,
                name: 'BMW M8 Competition',
                price: '$130,995',
                image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                specs: ['4.4L V8', '617 HP', '0-60 mph: 3.0s', 'Top Speed: 190 mph']
              },
              {
                id: 6,
                name: 'Ferrari F8 Tributo',
                price: '$276,000',
                image: 'https://images.unsplash.com/photo-1580273916551-e352f6acab98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                specs: ['3.9L V8', '710 HP', '0-60 mph: 2.9s', 'Top Speed: 211 mph']
              },
            ].map((car, index) => (
              <motion.div 
                key={car.id}
                className="bg-[#2e2e2e] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <picture>
                    <source 
                      srcSet={`${car.image}?format=webp`} 
                      type="image/webp"
                    />
                    <img 
                      src={car.image}
                      alt={car.name}
                      loading="lazy"
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      decoding="async"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-[#ffb600] text-black font-bold px-3 py-1 rounded-full text-sm">
                    {car.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{car.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {car.specs.map((spec, i) => (
                      <span key={i} className="text-xs bg-[#3e3e3e] text-gray-300 px-3 py-1 rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <button className="w-full bg-[#ffb600] hover:bg-[#e6a500] text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button 
              className="bg-transparent hover:bg-[#ffb600] text-[#ffb600] hover:text-black font-semibold py-3 px-8 border-2 border-[#ffb600] rounded-full transition-colors duration-200"
              onClick={onExploreCars}
            >
              View All Vehicles
            </button>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-[#1d1d1d] border-t border-[#2e2e2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Us</h2>
            <div className="w-20 h-1 bg-[#ffb600] mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12 text-[#ffb600]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Verified Listings",
                description: "Every vehicle in our inventory undergoes a thorough inspection to ensure quality and reliability."
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-[#ffb600]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Competitive Pricing",
                description: "We offer the best prices in the market with various financing options to suit your budget."
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-[#ffb600]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ),
                title: "24/7 Support",
                description: "Our dedicated support team is available round the clock to assist you with any queries or concerns."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-[#2e2e2e] p-6 rounded-xl hover:bg-[#3a3a3a] transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              className="bg-[#2e2e2e] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Contact Us</h3>
                <button 
                  onClick={() => setIsContactOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#3e3e3e] border border-[#4a4a4a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb600] focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#3e3e3e] border border-[#4a4a4a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb600] focus:border-transparent"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#3e3e3e] border border-[#4a4a4a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb600] focus:border-transparent"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    How can we help you?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#3e3e3e] border border-[#4a4a4a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb600] focus:border-transparent"
                    placeholder="Tell us about your inquiry..."
                    required
                  ></textarea>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#ffb600] hover:bg-[#e6a500] text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <span>Send Message</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default memo(LaptopView);
