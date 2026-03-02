import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Login = ({ onToggle, onLoginSuccess }) => {
  const [logindata, setlogindata] = useState({
    aadhaar: "",
    otp: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handlechange = (e) => {
    const { name, value } = e.target;
    setlogindata(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(logindata);
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-[#FFF] p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white rounded-[30px] shadow-2xl overflow-hidden">
        
        {/* Left: Form - Full width on mobile, 60% on desktop */}
        <div className="w-full lg:w-3/5 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-white order-2 lg:order-1 min-h-137.5 lg:min-h-150">
          
          {/* Loading Spinner */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center rounded-[30px]">
              <div className="w-12 h-12 border-4 border-[#8C52FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <motion.h1 
            initial={{ y: -20 }} animate={{ y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#8C52FF] mb-6 md:mb-8 tracking-tight text-center lg:text-left"
          >
            Log in
          </motion.h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 flex-1 flex flex-col justify-center">
            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-600 mb-1 block">Aadhar Number</label>
              <input 
                type="text" 
                onChange={handlechange}
                name="aadhaar"
                value={logindata.aadhaar}
                placeholder="0000 0000 0000"
                className="w-full bg-gray-100 border-2 border-transparent focus:border-[#8C52FF] focus:bg-white h-10 md:h-12 px-3 md:px-4 rounded-xl transition-all outline-none text-sm md:text-base"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-600 mb-1 block">OTP</label>
              <input 
                type="text" 
                name='otp'
                value={logindata.otp}
                onChange={handlechange}
                placeholder="00 00 00"
                className="w-full bg-gray-100 border-2 border-transparent focus:border-[#8C52FF] focus:bg-white h-10 md:h-12 px-3 md:px-4 rounded-xl transition-all outline-none text-sm md:text-base"
                required
                disabled={loading}
              />
            </div>

            <button 
              type='submit'
              disabled={loading}
              className={`flex justify-center py-2.5 md:py-3.5 bg-[#8C52FF] text-white text-base md:text-lg font-bold rounded-xl shadow-lg hover:shadow-[#8C52FF]/30 transition-all ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#5d1ce1]'
              }`}
            >
              {loading ? 'LOGGING IN...' : 'LOG IN'}
            </button>
          </form>

          <p className="mt-6 md:mt-8 text-center text-sm md:text-base text-gray-500">
            Already not a user{' '}
            <button 
              onClick={onToggle}
              className="text-[#734ff8] underline hover:underline transition-colors"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Right: Abstract Shape Section - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block lg:w-2/5 bg-[#8C52FF] relative overflow-hidden min-h-150">
          <div className="absolute w-64 h-64 border-4 border-white/10 rounded-full -top-20 -right-20" />
          <div className="absolute w-32 h-32 bg-white/5 rounded-full bottom-10 left-10" />
          
          {/* Simple rotating circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-white/20 rounded-full animate-spin-slow" />
          
          {/* Vertical Text */}
          <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-light tracking-widest  whitespace-nowrap">
            Build India Better
          </h2>
        </div>

        {/* Mobile Header - Visible only on mobile */}
        <div className="lg:hidden w-full bg-[#8C52FF] p-4 flex items-center justify-center order-1">
          <h2 className="text-white text-lg font-light tracking-widest text-center">
           Build India Better
          </h2>
        </div>
      </div>

      {/* Add this to your global CSS or tailwind.config.js */}
      <style>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;