import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
// import NavBar from '../src/components/navbar.jsx';
import { FaceSmileIcon } from '@heroicons/react/24/outline';
import GraphemeSplitter from 'grapheme-splitter';
import FeedbackHistory from '../src/components/feedbackhistory.jsx';
import Logo from '../src/assets/images/logo-2.png';

const EmojiPicker = lazy(() => import('emoji-picker-react'));

const FeedbackForm = () => {
  const [charCount, setCharCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeTab, setActiveTab] = useState('submit');
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const splitter = new GraphemeSplitter();

  useEffect(() => {
    document.body.style.backgroundColor = '#F5F5F7';
      return () => {
        document.body.style.backgroundColor = '';
    };
  }, []);

  // Mock feedback history data
  const mockFeedbackHistory = [
    { id: 1, text: 'The Wi-Fi in the library is very slow, especially during peak hours.', submitted: 'April 5, 2025', status: 'Resolved', adminReply: 'Wi-Fi upgrades completed on April 15. Speed tests show 5x improvement.' },
    { id: 2, text: 'Can we have more reference books for Computer Science courses in the library?', submitted: 'April 10, 2025', status: 'In Progress', adminReply: 'New book orders placed. Expected arrival by end of May.' },
    { id: 3, text: 'The air conditioning in Room 302 is not working properly.', submitted: 'April 12, 2025', status: 'Viewed', adminReply: null },
    { id: 4, text: 'Can we extend the library hours during finals week?', submitted: 'March 28, 2025', status: 'Noted—Thanks!', adminReply: 'We\'ll consider this for the next semester\'s schedule.' },
    { id: 5, text: 'Some of the lab computers need software updates.', submitted: 'March 20, 2025', status: 'Under Review', adminReply: null },
    { id: 6, text: 'The cafeteria food options are limited for vegetarians.', submitted: 'March 15, 2025', status: 'In Progress', adminReply: 'Working with the cafeteria to add more vegetarian options by next month.' },
    { id: 7, text: 'Can we have more study rooms available on weekends?', submitted: 'March 10, 2025', status: 'Noted—Thanks!', adminReply: 'We\'ll review the schedule for next semester.' },
    { id: 8, text: 'The projectors in Room 204 are outdated and often fail.', submitted: 'March 5, 2025', status: 'Under Review', adminReply: null },
    { id: 9, text: 'The library printers are frequently out of paper.', submitted: 'February 28, 2025', status: 'Resolved', adminReply: 'Increased paper restocking frequency starting March 1.' },
    { id: 10, text: 'Can we have more group study spaces in the library?', submitted: 'February 20, 2025', status: 'In Progress', adminReply: 'Planning to add 3 new group study rooms by April.' },
    { id: 11, text: 'The lighting in Room 305 is too dim for evening classes.', submitted: 'February 15, 2025', status: 'Viewed', adminReply: null },
    { id: 12, text: 'Can we get more power outlets in the common areas?', submitted: 'February 10, 2025', status: 'Noted—Thanks!', adminReply: 'This will be considered in the next renovation plan.' },
    { id: 13, text: 'The gym equipment needs maintenance; some machines are broken.', submitted: 'February 5, 2025', status: 'In Progress', adminReply: 'Repairs scheduled for next week.' },
    { id: 14, text: 'The lecture hall seats in Room 101 are uncomfortable.', submitted: 'January 30, 2025', status: 'Under Review', adminReply: null },
    { id: 15, text: 'Can we have more parking spaces for students?', submitted: 'January 25, 2025', status: 'Noted—Thanks!', adminReply: 'We\'ll explore options for the next semester.' },
    { id: 16, text: 'The library website is hard to navigate on mobile devices.', submitted: 'January 20, 2025', status: 'In Progress', adminReply: 'Mobile optimization in progress, expected completion by February.' },
    { id: 17, text: 'The vending machines in the student lounge are often out of stock.', submitted: 'January 15, 2025', status: 'Resolved', adminReply: 'Vendor has been notified and will restock more frequently.' },
    { id: 18, text: 'Can we have more career fairs for engineering students?', submitted: 'January 10, 2025', status: 'Noted—Thanks!', adminReply: 'Planning to schedule an additional fair in the spring.' },
    { id: 19, text: 'The Wi-Fi in the dorms drops frequently.', submitted: 'January 5, 2025', status: 'Under Review', adminReply: null },
    { id: 20, text: 'Can we have more tutoring sessions for math courses?', submitted: 'December 30, 2024', status: 'In Progress', adminReply: 'Additional sessions scheduled starting next month.' },
    { id: 21, text: 'Can we have more tutoring sessions for math courses?', submitted: 'December 30, 2024', status: 'In Progress', adminReply: 'Additional sessions scheduled starting next month.' },
    { id: 22, text: 'Can we have more tutoring sessions for math courses?', submitted: 'December 30, 2024', status: 'In Progress', adminReply: 'Additional sessions scheduled starting next month.' },
    { id: 23, text: 'Can we have more tutoring sessions for math courses?', submitted: 'December 30, 2024', status: 'In Progress', adminReply: 'Additional sessions scheduled starting next month.' },
    { id: 24, text: 'Can we have more tutoring sessions for math courses?', submitted: 'December 30, 2024', status: 'In Progress', adminReply: 'Additional sessions scheduled starting next month.' },
    { id: 25, text: 'Can we have more tutoring sessions for math courses?', submitted: 'December 30, 2024', status: 'In Progress', adminReply: 'Additional sessions scheduled starting next month.' },
    { id: 26, text: 'Can we have more tutoring sessions for math courses?', submitted: 'December 30, 2024', status: 'In Progress', adminReply: 'Additional sessions scheduled starting next month.' },
  ];

  // Simulate fetching feedback history
  useEffect(() => {
    if (activeTab === 'history') {
      setIsLoading(true);
      setTimeout(() => {
        setFeedbackHistory(mockFeedbackHistory);
        setIsLoading(false);
      }, 1500);
    }
  }, [activeTab]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setFeedback(text);
    const graphemeCount = splitter.countGraphemes(text);
    setCharCount(graphemeCount);
  };

  const handleEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    setFeedback((prev) => {
      const newText = prev + emoji;
      return newText;
    });
    setCharCount((prevCount) => {
      const newText = feedback + emoji;
      const graphemeCount = splitter.countGraphemes(newText);
      return graphemeCount;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim() === '') {
      alert('Please enter some feedback before submitting.');
      return;
    }
    console.log('Feedback submitted:', feedback);
    const newFeedback = {
      id: mockFeedbackHistory.length + feedbackHistory.length + 1,
      text: feedback,
      submitted: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Under Review',
      adminReply: null,
    };
    setFeedbackHistory([newFeedback, ...feedbackHistory]);
    setFeedback('');
    setCharCount(0);
  };

  const toggleEmojiPicker = (e) => {
    e.stopPropagation();
    setShowEmojiPicker((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <>
     <div className='max-w-[700px] mx-auto  p-8 justify-center'>

      <div>
        <img src={Logo} alt="" srcset="" className='h-10'/>
      </div>

      <div className="flex gap-3 mt-10 mb-5 border-b text-[16px] border-[#DEE2E6]">
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`px-2 py-1 cursor-pointer tracking-wide font-noto border-b-2 ${
              activeTab === 'submit'
                ? 'border-[#003366] text-[#003366] font-semibold'
                : 'border-transparent text-black'
            }`}
            aria-selected={activeTab === 'submit'}
          >
            Submit Feedback
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-2 py-1 cursor-pointer  tracking-wide font-noto border-b-2 ${
              activeTab === 'history'
                ? 'border-[#003366] text-[#003366] font-semibold'
                : 'border-transparent text-black'
            }`}
            aria-selected={activeTab === 'history'}
          >
            My Feedback History
          </button>
        </div>
        
        <div className="mt-10 p-5 bg-white shadow-md rounded-lg border border-[#DEE2E6]">
          {activeTab === 'submit' ? (
            <>
              <p className="text-[16px] mb-5 flex items-center font-noto tracking-normal text-[#1d2125]">
                Your feedback will be submitted anonymously to help us enhance The
                Lewis College. We assure you that no personal information will be
                shared.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <textarea
                    className="w-full text-[#1d2125] text-[16px] font-wide font-noto h-50 p-3 border border-[#CCCCCC] rounded-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#003366]"
                    name="feedback"
                    id="feedback"
                    maxLength="1000"
                    value={feedback}
                    onChange={handleInputChange}
                    placeholder="Share your feedback here..."
                  ></textarea>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-end gap-2.5 items-center relative">
                    <button
                      type="button"
                      ref={emojiButtonRef}
                      onClick={toggleEmojiPicker}
                      className="text-[#6a737b] hover:text-gray-800"
                      aria-label="Toggle emoji picker"
                    >
                      <FaceSmileIcon className="h-5 w-5" />
                    </button>
                    <p className="text-[#6a737b] text-sm">
                      {charCount}/1000 characters
                    </p>
                    {showEmojiPicker && (
                      <div
                        ref={emojiPickerRef}
                        className="absolute right-10 bottom-10 z-10 bg-white border border-gray-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out opacity-0 data-[visible=true]:opacity-100"
                        data-visible={showEmojiPicker}
                      >
                        <Suspense fallback={<div className="w-[300px] h-[350px] flex items-center justify-center">Loading...</div>}>
                          <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            width={300}
                            height={350}
                          />
                        </Suspense>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end mt-15">
                    <button
                      type="submit"
                      className="bg-[#003366] text-[15px] font-noto tracking-wide text-white px-4 py-2 rounded-full hover:bg-[#002a55] transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer"
                      disabled={charCount === 0}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <FeedbackHistory feedbackHistory={feedbackHistory} isLoading={isLoading} />
          )}
        </div>
     </div>
    </>
  );
};

export default FeedbackForm;