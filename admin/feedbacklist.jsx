import { useState } from 'react';
import { IconSearch, IconChevronDown, IconTrash, IconFilter } from '@tabler/icons-react';
import SideBar from '../src/components/sidebar';
import TopNav from '../src/components/navbar';
import FeedbackTable from '../src/table/FeedbackTable';
import ExportDropdown from '../src/dropdown/ExportDropdown';
import LastDayDropdown from '../src/dropdown/LastDaysDropdown';
import DeleteModal from '../src/modal/DeleteModal';

const FeedBackList = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const handleExport = (format) => {
    console.log(`Exporting as ${format}`);
  };

  const feedbackData = [
    { id: 1, user: 'John Doe', feedback: 'The Wi-Fi in the library is very slow, especially during peak hours.', date: 'April 15, 2025', sentiment: 'Negative', tag: 'UI', reply: 'The Wi-Fi in the library is very slow, especially during peak hours.', action: 'Web' },
    { id: 2, user: 'Jane Smith', feedback: 'The cafeteria food is not very good. It would be great to have more vegetarian options.', date: 'April 16, 2025', sentiment: 'Negative', tag: 'UX', reply: '-', action: 'Mobile' },
    { id: 3, user: 'Alice Johnson', feedback: 'The classrooms are too cold. It would be nice to have better temperature control.', date: 'April 17, 2025', sentiment: 'Negative', tag: 'UI', reply: 'The classrooms are too cold. It would be nice to have better temperature control.', action: 'Web' },
    { id: 4, user: 'Alice Johnson', feedback: 'The classrooms are too cold. It would be nice to have better temperature control.', date: 'April 17, 2025', sentiment: 'Negative', tag: 'UI', reply: 'The classrooms are too cold. It would be nice to have better temperature control.', action: 'Web' },
    { id: 5, user: 'Charlie Davis', feedback: 'The library hours are not convenient. It would be great to have extended hours during exam week.', date: 'April 19, 2025', sentiment: 'Negative', tag: 'UI', reply: '-', action: 'Web' },
    { id: 6, user: 'Diana Evans', feedback: 'The gym is always crowded. It would be nice to have more equipment.', date: 'April 20, 2025', sentiment: 'Negative', tag: 'UX', reply: 'The classrooms are too cold. It would be nice to have better temperature control.', action: 'Mobile' },
    { id: 7, user: 'Ethan Foster', feedback: 'The campus Wi-Fi is unreliable. I often lose connection.', date: 'April 21, 2025', sentiment: 'Negative', tag: 'UI', reply: 'The classrooms are too cold. It would be nice to have better temperature control.', action: 'Web' },
    { id: 8, user: 'Fiona Green', feedback: 'The shuttle service is not very reliable. It would be great to have real-time tracking.', date: 'April 22, 2025', sentiment: 'Negative', tag: 'UX', reply: 'The classrooms are too cold. It would be nice to have better temperature control.', action: 'Mobile' },
    { id: 9, user: 'George Harris', feedback: 'The dorms are too noisy. It would be nice to have quiet hours.', date: 'April 23, 2025', sentiment: 'Negative', tag: 'UI', reply: 'The classrooms are too cold. It would be nice to have better temperature control.', action: 'Web' },
    { id: 10, user: 'Hannah Ives', feedback: 'The campus events are not well advertised. It would be great to have a central calendar.', date: 'April 24, 2025', sentiment: 'Negative', tag: 'UX', reply: 'The classrooms are too cold. It would be nice to have better temperature control.', action: 'Mobile' },
    { id: 11, user: 'Ian Johnson', feedback: 'The library staff is very helpful and friendly.', date: 'April 25, 2025', sentiment: 'Good', tag: 'UI', reply: 'The classrooms are too cold. It would be nice to have better temperature control.', action: 'Web' },
    { id: 12, user: 'Jack King', feedback: 'The campus is beautiful and well-maintained.', date: 'April 26, 2025', sentiment: 'Good', tag: 'UX', reply: 'The classrooms are too cold. It would be nice to have better temperature control.', action: 'Mobile' },
    { id: 13, user: 'Kathy Lee', feedback: 'The professors are very knowledgeable and approachable.', date: 'April 27, 2025', sentiment: 'Good', tag: 'UI', reply: 'The classrooms are too cold. It would be nice to have better temperature control.', action: 'Web' },
    { id: 14, user: 'Liam Miller', feedback: 'The campus is very safe and secure.', date: 'April 28, 2025', sentiment: 'Good', tag: 'UX', reply: 'The classrooms are too cold. It would be nice to have better temperature control.', action: 'Mobile' },
    { id: 15, user: 'Liam Miller', feedback: 'The campus is very safe and secure.', date: 'April 28, 2025', sentiment: 'Good', tag: 'UX', reply: 'The classrooms are too cold. It would be nice to have better temperature control.', action: 'Mobile' },

  ];
  
  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setFeedbackData([]); // Clear all feedback items
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen dark:bg-[#1e2022]">
      <SideBar collapsed={isCollapsed} />
      <div className="flex-1">
        <TopNav isCollapsed={isCollapsed} onToggle={toggleSidebar} />
        <main
          className={`transition-all duration-300 ${
            isCollapsed ? 'ml-[80px]' : 'ml-[260px]'
          } mt-16`}
        >
          <div className="w-full p-8 border-b border-[#C3D3DB] dark:border-[#2f3235]">
            <h1 className="text-2xl font-semibold text-[#1B2124]  dark:text-[#ebf2f5]">Feedback List</h1>
          </div>
          {/* <div className='px-8 mt-5 flex items-center space-x-8'>
            <h3>All Feedback</h3>
            <h3>Summarized Feedback</h3>
          </div> */}
          <div className="px-8 w-full mt-8">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="relative max-w-lg">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <IconSearch size={20} color="#6B7280" />
                  </span>
                  <input
                    type="search"
                    name="search"
                    id="search"
                    placeholder="Search ..."
                    className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border border-[#C3D3DB] rounded-sm focus:outline-none focus:ring-1 tracking-normal focus:ring-[#3385F0] text-[15px] text-[#1B2124] placeholder-gray-400 dark:bg-[#202325] dark:text-[#ebf2f5] dark:border-[#2f3235] dark:placeholder-gray-500"
                  />
                </div>
                <ExportDropdown onExport={handleExport} />
                {/* <input type="date" name="" id="" /> */}
                <LastDayDropdown  />
                <button
                  className="flex items-center space-x-2 border text-[#1B2124] border-[#C3D3DB] px-3 py-2 rounded-sm hover:bg-[#3385F0]/20 hover:text-[#3385F0] tracking-normal text-[15px] cursor-pointer dark:bg-[#1B2124] dark:text-[#ebf2f5] dark:border-[#31374a] dark:hover:bg-[#3385F0]/20 dark:hover:text-[#3385F0]"
                >
                  <IconFilter size={16} stroke={2} />
                  <span>More Filters</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center tracking-normal space-x-2 px-3 py-2 bg-[#FF6363] text-white rounded-sm hover:bg-[#e55a5a] text-[15px] cursor-pointer"
                >
                  <IconTrash size={16} color="#ffffff" />
                  <span>Delete</span>
                </button>
                <button
                  className="flex items-center tracking-normal space-x-2 px-3 py-2 bg-[#3385F0] text-white rounded-sm hover:bg-[#2b73d1] text-[15px] cursor-pointer"
                >
                  <span>Summarize</span>
                </button>
              </div>
            </div>
          </div>
          <div className="px-8 w-full my-8">
            <FeedbackTable feedbackData={feedbackData} />
          </div>
          <DeleteModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete}
          />
        </main>
      </div>
    </div>
  );
};

export default FeedBackList;