import React, { useState, useEffect } from 'react';
import { IconX } from '@tabler/icons-react';

const CampaignForm = ({ title = 'Submit Your Feedback', placeholder = 'Share your thoughts...' }) => {
  const [feedback, setFeedback] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setFeedbackError('Feedback is required');
      return;
    }
    setShowSuccess(true);
    setFeedback('');
    setFeedbackError('');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  useEffect(() => {
    return () => clearTimeout();
  }, []);

  const handleDismissSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
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
          placeholder={placeholder}
          className={`w-full text-[15px] tracking-wide p-2.5 border text-[#1B2124] dark:text-[#EBF2F5] bg-white dark:bg-[#202325] ${
            feedbackError ? 'border-red-500' : 'border-[#C3D3DB] dark:border-[#2f3235]'
          } rounded focus:outline-none focus:ring-1 focus:ring-[#3385F0] min-h-[200px]`}
        />
        {feedbackError && (
          <p className="text-red-500 text-[14px] mt-1">*{feedbackError}</p>
        )}
      </div>
      <div className="flex justify-end">
        <button
            type="submit"
            className="px-3 py-2 tracking-wide bg-[#3385F0] text-white rounded inline-flex items-center justify-center cursor-pointer hover:bg-[#2b73d1] transition-colors duration-200 text-[14px]"
        >
            Submit Feedback
        </button>
     </div>
    </form>
  );
};

export default CampaignForm;