import React, { useState } from 'react';
import { IconUser, IconEyeOff, IconEye, IconCheck, IconBrandGoogle, IconChartBar, IconMessageCircle, IconSchool } from '@tabler/icons-react';
import Logo from '../../src/assets/images/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Please enter a valid password';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate inputs
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError || passwordValidationError) {
      setEmailError(emailValidationError);
      setPasswordError(passwordValidationError);
      return;
    }

    // Mock login logic
    if (email === 'admin@example.com' && password === 'password123') {
      alert('Login successful!');
    } else {
      setEmailError('Invalid email or password');
      setPasswordError('Invalid email or password');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="flex flex-col md:flex-row max-w-5xl w-full mx-auto">
        {/* Left Promotional Section */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <img src={Logo} alt="Logo" className="h-12" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1B2124] mb-10">
            Analyze Student Feedback with SuggestAI
          </h2>
          <ul className="space-y-5">
            <li className="flex items-start">
              <IconCheck size={20} className="text-blue-500 mr-3 mt-1" />
              <div>
                <span className="font-medium text-[#1B2124] tracking-normal">Topic Modeling Insights</span>
                <p className="text-[#1B2124] text-[14px] tracking-wide">
                  Automatically identify key themes and patterns in student feedback using advanced topic modeling.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <IconCheck size={20} className="text-blue-500 mr-3 mt-1" />
              <div>
                <span className="font-medium text-[#1B2124] tracking-normal">Summarize Feedback</span>
                <p className="text-[#1B2124] text-[14px] tracking-wide">
                  Effortlessly summarize student feedback to uncover key insights and trends for better decision-making.
                </p>
              </div>
            </li>
          </ul>
          <div className="flex space-x-6 mt-8 items-center justify-center">
            <IconChartBar size={35} className="text-gray-400" />
            <IconMessageCircle size={35} className="text-gray-400" />
            <IconSchool size={35} className="text-gray-400" />
          </div>
        </div>

        {/* Right Login Form Section */}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-semibold text-[#1B2124] mb-6">Sign in</h1>
          <button
            type="button"
            className="w-full flex items-center justify-center py-2 mb-4 border border-[#C3D3DB] rounded hover:bg-[#F5F5F7] cursor-pointer"
          >
            <IconBrandGoogle size={20} className="mr-2 text-[#1B2124]" />
            <span className="text-[#1B2124]">Sign in with Google</span>
          </button>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">OR</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="mb-4 relative">
              <label htmlFor="email" className="text-[15px] text-[#1B2124] tracking-normal mb-2 block">
                Your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                placeholder="email@address.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                className={`w-full text-[15px] tracking-wide p-2.5 border text-[#1B2124] ${
                  emailError ? 'border-red-500' : 'border-[#C3D3DB]'
                } rounded focus:outline-none focus:ring-1 focus:ring-[#3385F0]`}
              />
              {emailError && (
                <p className="text-red-500 text-[14px] mt-1">{emailError}</p>
              )}
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="text-[15px] text-[#1B2124] tracking-normal mb-2 block">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  placeholder="8+ characters required"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  className={`w-full text-[15px] p-2.5 tracking-normal border text-[#1B2124] ${
                    passwordError ? 'border-red-500' : 'border-[#C3D3DB]'
                  } rounded focus:outline-none focus:ring-1 focus:ring-[#3385F0]`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 focus:outline-none"
                >
                  {showPassword ? (
                    <IconEyeOff stroke={2} size={20} />
                  ) : (
                    <IconEye stroke={2} size={20} />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-[14px] mt-1">{passwordError}</p>
              )}
              <div className="flex justify-between items-center mt-4 mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-[#3385F0] focus:ring-[#3385F0] border-[#C3D3DB] rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 text-[14px] text-[#1B2124]"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-[#3385F0] hover:underline text-[14px]"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 tracking-wide bg-[#3385F0] text-white rounded flex items-center justify-center cursor-pointer hover:bg-[#2b73d1] transition-colors duration-200"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;