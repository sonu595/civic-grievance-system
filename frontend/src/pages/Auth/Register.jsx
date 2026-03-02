import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from "axios";

const Register = ({ onToggle }) => {
  const [registerData, setRegisterData] = useState({
    name: "",
    contactNumber: "",
    aadhaar: "",
    otp: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        registerData
      );

      setLoading(false);
      alert("Registration Successful! Please login.");
      onToggle();

    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }

      setError(errorMessage);
      console.log(error);
      
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF] p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white rounded-[30px] shadow-2xl overflow-hidden">
        
        {/* Right Side: Form Section - Full width on mobile, 60% on desktop */}
        <div className="w-full lg:w-3/5 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-white order-2 lg:order-2 min-h-[550px] lg:min-h-[600px]">
          
          {/* Loading Spinner */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center rounded-[30px]">
              <div className="w-12 h-12 border-4 border-[#8C52FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#8C52FF] mb-6 md:mb-8 text-center lg:text-left tracking-tight"
          >
            Create Account
          </motion.h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs md:text-sm font-semibold text-gray-500 mb-1 block uppercase">Name</label>
                <input 
                  type="text" 
                  name='name'
                  value={registerData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full bg-gray-100 border-2 border-transparent focus:border-[#8C52FF] focus:bg-white h-10 md:h-11 px-3 md:px-4 rounded-xl transition-all outline-none text-sm md:text-base"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-gray-500 mb-1 block uppercase">Mobile No.</label>
                <input 
                  type="text" 
                  name='contactNumber'
                  value={registerData.contactNumber}
                  onChange={handleChange}
                  placeholder="+91..."
                  className="w-full bg-gray-100 border-2 border-transparent focus:border-[#8C52FF] focus:bg-white h-10 md:h-11 px-3 md:px-4 rounded-xl transition-all outline-none text-sm md:text-base"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-500 mb-1 block uppercase">Aadhar Number</label>
              <input 
                type="text" 
                name='aadhaar'
                value={registerData.aadhaar}
                onChange={handleChange}
                placeholder="0000 0000 0000"
                className="w-full bg-gray-100 border-2 border-transparent focus:border-[#8C52FF] focus:bg-white h-10 md:h-11 px-3 md:px-4 rounded-xl transition-all outline-none text-sm md:text-base"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-500 mb-1 block uppercase">OTP</label>
              <input 
                type="text" 
                name='otp'
                value={registerData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                className="w-full bg-gray-100 border-2 border-transparent focus:border-[#8C52FF] focus:bg-white h-10 md:h-11 px-3 md:px-4 rounded-xl transition-all outline-none text-sm md:text-base"
                disabled={loading}
                required
              />
            </div>

            <button 
              type='submit'
              disabled={loading}
              className={`w-full py-2.5 md:py-3 bg-[#8C52FF] text-white text-base md:text-lg font-bold rounded-xl shadow-lg mt-2 shadow-[#8C52FF]/20 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#6929e9]'
              }`}
            >
              {loading ? 'PROCESSING...' : 'REGISTER NOW'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm md:text-base text-gray-500">
            Already a member?{' '}
            <button 
              onClick={onToggle}
              className="text-[#7358ee] underline  hover:underline transition-colors"
            >
              Login here
            </button>
          </p>
        </div>

        {/* Left Side: Brown Panel - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block lg:w-2/5 bg-[#8C52FF] relative overflow-hidden order-1 lg:order-1 min-h-[600px]">
          {/* Floating Background Shapes */}
          <div className="absolute w-64 h-64 bg-white/5 rounded-[40px] -top-20 -left-20" />
          <div className="absolute w-40 h-40 border border-white/10 rounded-full -bottom-12.5 -right-12.5" />
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center px-6 w-full">
            <div className="w-16 h-1 bg-white/30 mx-auto mb-4" />
            <h2 className="text-white text-3xl font-bold mb-2">Join Us</h2>
            <p className="text-white/60 text-sm font-light">Start your journey</p>
          </div>
        </div>

        {/* Mobile Header - Visible only on mobile */}
        <div className="lg:hidden w-full bg-[#8C52FF] p-4 flex items-center justify-center order-1">
          <h2 className="text-white text-lg font-light tracking-widest text-center">
            join us • start your journey
          </h2>
        </div>
        
      </div>
    </div>
  );
};

export default Register;