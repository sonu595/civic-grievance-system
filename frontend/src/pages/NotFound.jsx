import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDEBD0] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-2xl mx-auto">
        {/* Animated 404 */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-8xl md:text-9xl font-black text-[#8C52FF] tracking-tighter mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-[#5C4016] mb-6"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed"
        >
          Oops! The page you're looking for doesn't exist or has been moved.  
          Let's get you back on track.
        </motion.p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>

          <Button
            variant="outline"
            size="large"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>

        {/* Fun element - optional blurred background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-[#8C52FF] opacity-5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-[#E67E22] opacity-5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;