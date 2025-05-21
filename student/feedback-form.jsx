import React, { useState, useEffect } from 'react';
import { IconCheck, IconMessageCircle, IconSchool, IconThumbUp, IconX } from '@tabler/icons-react';
import Logo from '../src/assets/images/logo.png';
import CampaignForm from '../src/components/campaign_form';

const FeedBackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!feedback.trim()) {
      setFeedbackError('Feedback is required');
      return;
    }

    // Show success alert
    setShowSuccess(true);
    setFeedback(''); // Clear form
    setFeedbackError('');

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => clearTimeout();
  }, []);

  const handleDismissSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#202325] p-4">
      <div className="flex flex-col md:flex-row max-w-5xl w-full mx-auto">
        {/* Left Promotional Section */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <img src={Logo} alt="Lewis College Logo" className="h-12" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1B2124] dark:text-[#EBF2F5] mb-10">
            Share Anonymous Feedback to Improve Lewis College
          </h2>
          <ul className="space-y-5">
            <li className="flex items-start">
              <IconCheck size={20} className="text-blue-500 mr-3 mt-1" />
              <div>
                <span className="font-medium text-[#1B2124] dark:text-[#EBF2F5] tracking-normal">
                  Anonymous Feedback
                </span>
                <p className="text-[#1B2124] dark:text-[#EBF2F5] text-[14px] tracking-wide">
                  Share your thoughts freely without revealing your identity, ensuring honest and open feedback.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <IconCheck size={20} className="text-blue-500 mr-3 mt-1" />
              <div>
                <span className="font-medium text-[#1B2124] dark:text-[#EBF2F5] tracking-normal">
                  Help Us Improve
                </span>
                <p className="text-[#1B2124] dark:text-[#EBF2F5] text-[14px] tracking-wide">
                  Your feedback helps Lewis College enhance the student experience, from facilities to academics.
                </p>
              </div>
            </li>
          </ul>
          <div className="flex space-x-6 mt-8 items-center justify-center">
            <IconMessageCircle size={35} className="text-gray-400 dark:text-gray-500" />
            <IconSchool size={35} className="text-gray-400 dark:text-gray-500" />
            <IconThumbUp size={35} className="text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* Right Feedback Form Section */}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-semibold text-[#1B2124] dark:text-[#EBF2F5] mb-6">
            Submit Your Feedback
          </h1>
          {/* <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="mb-4">
              {showSuccess && (
                <div
                  className="flex items-center justify-between mb-2 p-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-[14px] rounded transition-opacity duration-300"
                  style={{ opacity: showSuccess ? 1 : 0 }}
                >
                  <span>Feedback submitted successfully!</span>
                  <button
                    type="button"
                    onClick={handleDismissSuccess}
                    className="text-green-800 dark:text-green-200 hover:text-green-900 dark:hover:text-green-300"
                  >
                    <IconX size={16} stroke={2} />
                  </button>
                </div>
              )}
              <label
                htmlFor="feedback"
                className="text-[15px] text-[#1B2124] dark:text-[#EBF2F5] tracking-normal mb-2 block"
              >
                Your Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => {
                  setFeedback(e.target.value);
                  setFeedbackError('');
                }}
                placeholder="Share your thoughts about Lewis College..."
                className={`w-full text-[15px] tracking-wide p-2.5 border text-[#1B2124] dark:text-[#EBF2F5] bg-white dark:bg-[#202325] ${
                  feedbackError ? 'border-red-500' : 'border-[#C3D3DB] dark:border-[#2f3235]'
                } rounded focus:outline-none focus:ring-1 focus:ring-[#3385F0] min-h-[220px]`}
              />
              {feedbackError && (
                <p className="text-red-500 text-[14px] mt-1">*{feedbackError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 tracking-wide bg-[#3385F0] text-white rounded flex items-center justify-center cursor-pointer hover:bg-[#2b73d1] transition-colors duration-200"
            >
              Submit
            </button>
          </form> */}
          <CampaignForm
            title="Submit Your Feedback"
            placeholder="Share your thoughts about Lewis College..."
          />
          {/* Campaign Card */}
          {/* <CampaignCard
            campaign={{
              name: 'Open Day Feedback',
              description: 'Help us improve our Open Day event!',
              date: 'May 10, 2025',
            }}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default FeedBackForm;