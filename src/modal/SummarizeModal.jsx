import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { IconTrash, IconX, IconCopy, IconRefresh } from '@tabler/icons-react';

const SummarizeModal = ({ isOpen, onClose, feedbackText, onSummarize }) => {
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const paragraphButtonRef = useRef(null);
  const bulletPointsButtonRef = useRef(null);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [activeMode, setActiveMode] = useState('Paragraph'); 
  const [summaryLength, setSummaryLength] = useState(0);
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const [summaryText, setSummaryText] = useState('');

  const feedbackCount = feedbackText
    ? feedbackText.split('\n\n').filter((text) => text.trim()).length
    : 0;

  const lengthLabels = { 0: 'Short', 1: 'Medium', 2: 'Long' };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => {
        updateUnderline();
      }, 0);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
      cancelButtonRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const updateUnderline = () => {
    const activeButton =
      activeMode === 'Paragraph' ? paragraphButtonRef.current : bulletPointsButtonRef.current;
    if (activeButton) {
      const { offsetWidth, offsetLeft } = activeButton;
      const parent = activeButton.closest('.modes-container');
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        const relativeLeft = buttonRect.left - parentRect.left;
        setUnderlineStyle({ width: offsetWidth, left: relativeLeft });
      }
    }
  };

  useEffect(() => {
    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [activeMode]);

  const handleModeChange = (mode) => {
    setActiveMode(mode);
  };

  const handleLengthChange = (e) => {
    setSummaryLength(Number(e.target.value));
  };

  const handleSummarize = () => {
    const summary = onSummarize(feedbackText, activeMode, summaryLength); 
    setSummaryText(summary || 'Summarized content will appear here...');
  };

  const handleCopy = () => {
    if (summaryText) {
      navigator.clipboard.writeText(summaryText);
    }
  };

  const handleRefresh = () => {
    handleSummarize();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ease-out ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-sm border border-[#e5e7eb] shadow-lg w-full max-w-4xl md:mx-auto mt-5 relative transition-all duration-300 ease-out transform dark:bg-[#1e2022] dark:border-[#2f3235] ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between border-b p-3 border-[#e5e7eb] dark:border-[#2f3235]">
          <span
            id="modal-title"
            className="text-[15px] font-semibold text-[#1B2124] tracking-normal dark:text-[#ebf2f5]"
          >
            Summarize Feedback
          </span>
          <button
            ref={cancelButtonRef}
            onClick={onClose}
            className="text-[#1B2124] p-1 cursor-pointer hover:bg-[#F5F5F7] rounded-sm dark:text-[#ebf2f5] dark:hover:bg-[#2f3235]"
            aria-label="Close modal"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* First Row: Modes */}
        <div
          className="border-b p-3 border-[#e5e7eb] flex items-center justify-between dark:border-[#2f3235] relative modes-container"
          style={{
            '--underline-width': `${underlineStyle.width}px`,
            '--underline-left': `${underlineStyle.left}px`,
          }}
        >
          <div className="flex items-center space-x-15">
            <div className="flex items-center space-x-5">
              <span className="font-medium text-[14px] text-[#1B2124] tracking-normal dark:text-[#ebf2f5]">
                Modes:
              </span>
              <div className="space-x-4">
                <button
                  ref={paragraphButtonRef}
                  onClick={() => handleModeChange('Paragraph')}
                  className={`text-[14px] tracking-normal transition-colors duration-200 cursor-pointer ${
                    activeMode === 'Paragraph'
                      ? 'text-[#3385F0]'
                      : 'text-[#1B2124] dark:text-[#ebf2f5] hover:text-[#3385F0]'
                  }`}
                  aria-label="Select Paragraph mode"
                >
                  Paragraph
                </button>
                <button
                  ref={bulletPointsButtonRef}
                  onClick={() => handleModeChange('Bullet Points')}
                  className={`text-[14px] tracking-normal transition-colors duration-200 cursor-pointer ${
                    activeMode === 'Bullet Points'
                      ? 'text-[#3385F0]'
                      : 'text-[#1B2124] dark:text-[#ebf2f5] hover:text-[#3385F0]'
                  }`}
                  aria-label="Select Bullet Points mode"
                >
                  Bullet Points
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-5">
              <span className="font-medium text-[14px] text-[#1B2124] tracking-normal dark:text-[#ebf2f5]">
                Length:
              </span>
              <div className="flex items-center space-x-5">
                <span className="text-[#64748B] text-[14px] tracking-normal dark:text-[#8B9BAE]">
                  {lengthLabels[summaryLength]}
                </span>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={summaryLength}
                  onChange={handleLengthChange}
                  className="w-24 accent-[#3385F0] cursor-pointer"
                  aria-label={`Summary length: ${lengthLabels[summaryLength]}`}
                />
              </div>
            </div>
          </div>
          {/* <button
            disabled
            className="text-[#1B2124] opacity-50 dark:text-[#ebf2f5]"
            aria-label="Clear input (disabled)"
          >
            <IconTrash stroke={2} size={18} />
          </button> */}
          {/* Pseudo-element for blue underline */}
          <style>
            {`
              .modes-container::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: var(--underline-left);
                width: var(--underline-width);
                border-bottom: 2px solid #3385F0;
                transition: all 0.2s ease;
              }
            `}
          </style>
        </div>

        {/* Second Row: Two Columns with Border in Between */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="md:border-r md:border-[#e5e7eb] dark:md:border-[#2f3235]">
            <div className="p-3 text-[15px] text-[#1B2124] dark:text-[#ebf2f5]">
              Selected Feedback ({feedbackCount})
            </div>
            <div className="p-3">
              <textarea
                name="feedback"
                id="feedback"
                value={feedbackText}
                readOnly
                className="w-full h-[400px] outline-none p-3 border border-[#e5e7eb] rounded-sm focus:ring-1 focus:ring-[#3385F0] focus:border-[#3385F0] dark:bg-[#202325] dark:border-[#2f3235] dark:text-[#ebf2f5] text-[14px]"
                aria-label={`Selected feedback (${feedbackCount} items)`}
              ></textarea>
            </div>
          </div>
          <div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-[15px] text-[#1B2124] dark:text-[#ebf2f5]">Summary</span>
              <div className="flex items-center space-x-3">
                <button className='text-[#1B2124] dark:text-[#ebf2f5] cursor-pointer'>
                    <IconTrash stroke={2} size={17} />
                </button>
                <button
                  onClick={handleCopy}
                  className="text-[#1B2124] dark:text-[#ebf2f5] cursor-pointer"
                  aria-label="Copy summary"
                  disabled={!summaryText}
                >
                  <IconCopy stroke={2} size={17} />
                </button>
                <button
                  onClick={handleRefresh}
                  className="text-[#1B2124] dark:text-[#ebf2f5] cursor-pointer"
                  aria-label="Refresh summary"
                  disabled={!feedbackText}
                >
                  <IconRefresh stroke={2} size={17} />
                </button>
              </div>
            </div>
            <div className="p-3">
              <textarea
                name="summary"
                id="summary"
                value={summaryText}
                readOnly
                className="w-full h-[400px] outline-none p-3 border border-[#e5e7eb] rounded-sm focus:ring-1 focus:ring-[#3385F0] focus:border-[#3385F0] dark:bg-[#202325] dark:border-[#2f3235] dark:text-[#ebf2f5] text-[15px]"
                aria-label="Summary output"
                placeholder="Summarized content will appear here..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t border-[#e5e7eb] dark:border-[#2f3235]">
          <button
            onClick={onClose}
            className="px-3 py-[7px] text-[#1B2124] border border-[#e5e7eb] rounded-sm hover:bg-[#F5F5F7] text-[14px] tracking-normal transition-colors duration-300 cursor-pointer dark:bg-[#202325] dark:text-[#ebf2f5] dark:border-[#2f3235] dark:hover:bg-[#1e2022]"
          >
            Cancel
          </button>
          <button
            onClick={handleSummarize}
            className="px-3 py-[7px] bg-[#3385F0] text-white rounded-sm hover:bg-[#2b73d1] text-[14px] tracking-normal transition-colors duration-300 cursor-pointer"
            disabled={!feedbackText}
          >
            Summarize
          </button>
        </div>
      </div>
    </div>
  );
};

SummarizeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  feedbackText: PropTypes.string.isRequired,
  onSummarize: PropTypes.func.isRequired,
};

export default SummarizeModal;