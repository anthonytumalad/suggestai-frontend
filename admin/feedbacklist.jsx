import { useState, useRef, useEffect } from 'react';
import { IconSearch, IconTrash, IconSparkles } from '@tabler/icons-react';
import FeedbackTable from '../src/table/FeedbackTable';
import ExportDropdown from '../src/dropdown/ExportDropdown';
import LastDayDropdown from '../src/dropdown/LastDaysDropdown';
import DeleteModal from '../src/modal/DeleteModal';
import FilterDropdown from '../src/dropdown/FilterDropdown';
import Summary from './feedbacksummary';

const FeedBackList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('List');
  const [selectedRows, setSelectedRows] = useState([]); 
  const menuRefs = useRef({});
  const containerRef = useRef(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 }); 

  const [feedbackData, setFeedbackData] = useState([
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
  ]);
  const [searchQuery, setSearchQuery] = useState('');



  const menuItems = ['List', 'Summary'];

  const handleExport = (format) => {
    console.log(`Exporting as ${format}`);
  };

 

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (paginatedData) => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map((row) => row.id));
    }
  };
  
  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setFeedbackData((prev) => prev.filter((item) => !selectedRows.includes(item.id)));
    setSelectedRows([]); 
    setIsModalOpen(false);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (activeMenu && menuRefs.current[activeMenu] && containerRef.current) {
      const menuItem = menuRefs.current[activeMenu];
      const container = containerRef.current;
      const { width } = menuItem.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const menuItemRect = menuItem.getBoundingClientRect();
      const leftOffset = menuItemRect.left - containerRect.left;
      setUnderlineStyle({ left: leftOffset, width });
    }
  }, [activeMenu]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredFeedbackData = feedbackData.filter((item) =>
    item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.feedback.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sentiment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTabContent = () => {
    switch (activeMenu) {
      // case 'Overview':
      //   return <Overview feedbackData={feedbackData} />;
      case 'List':
        return (
          <>
          <div className="px-4 sm:px-6 lg:px-7 w-full mt-8">
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
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border border-[#C3D3DB] rounded-sm focus:outline-none focus:ring-1 tracking-normal focus:ring-[#3385F0] text-[15px] text-[#1B2124] placeholder-gray-400 dark:bg-[#202325] dark:text-[#ebf2f5] dark:border-[#2f3235] dark:placeholder-gray-500"
                />
              </div>
              <ExportDropdown onExport={handleExport} />
              <LastDayDropdown  />
              <FilterDropdown />
            </div>
            <div className="flex items-center space-x-2">
              {selectedRows.length > 0 && (
                <span className="text-[15px] text-[#1B2124] dark:text-[#ebf2f5] mr-4">
                  {selectedRows.length} selected
                </span>
              )}
              <button
                onClick={selectedRows.length > 0 ? handleDeleteClick : undefined}
                disabled={selectedRows.length === 0}
                className={`group flex items-center tracking-normal space-x-1 px-3 py-2 border border-[#FF6363] 
                text-[#FF6363] rounded-sm text-[15px] transition-colors duration-300 ${
                  selectedRows.length === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : isModalOpen
                    ? 'bg-[#FF6363] text-white'
                    : 'hover:bg-[#FF6363] cursor-pointer hover:text-white'
                }`}              >
                <IconTrash size={16} stroke={2} 
                  className={`transition-colors duration-300 ${
                    selectedRows.length === 0
                      ? 'text-[#FF6363]'
                      : isModalOpen
                      ? 'text-white'
                      : 'text-[#FF6363] group-hover:text-white'
                  }`}
                />
                <span>Delete</span>
              </button>
              <button
                onClick={() => setActiveMenu('Summary')}
                disabled={selectedRows.length === 0}
                className={`group flex items-center tracking-normal space-x-1 px-3 py-2 border border-[#3385F0] text-[#3385F0] rounded-sm text-[15px] transition-colors duration-300 ${
                  selectedRows.length === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-[#3385F0] cursor-pointer hover:text-white'
                }`}                
              >
                <IconSparkles stroke={2} size={16} 
                  className={`transition-colors duration-300 ${
                    selectedRows.length === 0
                      ? 'text-[#3385F0]'
                      : 'text-[#3385F0] group-hover:text-white'
                  }`}                />
                <span>Summarize</span>
              </button>
            </div>
          </div>
        </div>
        <div className="px-7 w-full my-8">
            {/* <FeedbackTable feedbackData={feedbackData} /> */}
            <FeedbackTable
                feedbackData={filteredFeedbackData}
                selectedRows={selectedRows}
                onCheckboxChange={handleCheckboxChange}
                onSelectAll={handleSelectAll}
              />
        </div>
        </>
        );
      case 'Summary':
        const selectedFeedback = feedbackData.filter((item) => selectedRows.includes(item.id));
        return <Summary feedbackData={selectedFeedback} />;
      default:
        return null;      
    }
  };

  return (
    <div className="flex min-h-screen dark:bg-[#1e2022]">
      <div className="flex-1">
        <main>
         <div className="w-full px-7 pt-7 border-b border-[#C3D3DB] dark:border-[#2f3235]">
            <span className="text-[24px] font-semibold text-[#1B2124] dark:text-[#ebf2f5]">
              All Feedback
            </span>
            <div className="relative flex space-x-8 mt-4" ref={containerRef}>
              {menuItems.map((item) => (
                <button
                  key={item}
                  ref={(el) => (menuRefs.current[item] = el)} 
                  onClick={() => setActiveMenu(item)}
                  className={`py-3 text-[16px] rounded-sm transition-colors duration-200 cursor-pointer ${
                    activeMenu === item
                      ? 'text-[#3385F0] font-semibold'
                      : 'text-[#1B2124] dark:text-[#ebf2f5] hover:text-[#3385F0]'
                  }`}
                >
                  {item}
                </button>
              ))}
              {/* Blue underline for the active tab */}
              {activeMenu && (
                <span
                  className="absolute bottom-0 h-[2px] bg-[#3385F0] transition-all duration-200"
                  style={{
                    left: underlineStyle.left,
                    width: underlineStyle.width,
                  }}
                />
              )}
            </div>
          </div>
          
          {/* <div className="px-8 w-full mt-8">
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
                <LastDayDropdown  />
                <FilterDropdown />
              </div>
              <div className="flex items-center space-x-2">
              
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center tracking-normal space-x-2 px-3 py-2 bg-[#FF6363] text-white rounded-sm hover:bg-[#e55a5a] text-[15px] cursor-pointer"
                >
                  <IconTrash size={16} stroke={2} className="text-white" />
                  <span>Delete</span>
                </button>
                <button
                  className="flex items-center tracking-normal space-x-2 px-3 py-2 bg-[#3385F0] text-white rounded-sm hover:bg-[#2b73d1] text-[15px] cursor-pointer"
                >
                  <IconClipboardList stroke={2} size={16} className="text-white" />
                  <span>Summarize</span>
                </button>
              </div>
            </div>
          </div>
          <div className="px-8 w-full my-8">
            <FeedbackTable feedbackData={feedbackData} />
          </div> */}

          {renderTabContent()}

          <DeleteModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete}
            message={`Are you sure you want to delete ${selectedRows.length} feedback item${selectedRows.length === 1 ? '' : 's'}? This action cannot be undone.`}
          />
        </main>
      </div>
    </div>
  );
};

export default FeedBackList;



