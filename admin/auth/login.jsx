import React, { useState } from 'react';
import { UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import Logo from '../../src/assets/images/logo.png';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Mock login logic
    if (email === 'admin@example.com' && password === 'password123') {
      alert('Login successful!');
    } else {
      setError('Invalid email or password');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-sm my-15 mx-auto p-4 justify-center border border-gray-300 shadow-lg rounded-sm">
      <div className="mb-13">
        <img src={Logo} alt="Logo" className="mx-auto h-20" />
      </div>
      {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="mb-4 relative">
          <label
            htmlFor="email"
            className="text-[15px] font-noto text-black block mb-1 tracking-wide"
          >
            Your Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              placeholder='email@address.com'
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-[15px] font-noto tracking-wide p-2.5 border border-[#CCCCCC] focus:outline-none focus:ring-1 focus:ring-[#003366] rounded-sm"
            />
            <UserIcon className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
          </div>
        </div>
        <div className="mb-4 relative">
          <label
            htmlFor="password"
            className="text-[15px] font-noto text-black block mb-1 tracking-wide"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              placeholder='********'
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-[15px] p-2.5 font-noto tracking-wide border border-[#CCCCCC] focus:outline-none focus:ring-1 focus:ring-[#003366] rounded-sm"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 focus:outline-none"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="text-left mb-15">
          <a href="#" className="text-[#003366] hover:underline text-[15px] font-noto">
            Forgot Password?
          </a>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-noto tracking-wide bg-[#003366] text-white rounded flex items-center justify-center cursor-pointer hover:bg-[#002244] transition-colors duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;