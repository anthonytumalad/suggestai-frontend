import { useState } from 'react';
import {
  IconSearch,
  IconTrash,
  IconClipboardList,
  IconSparkles,
  IconHistory,
  IconX,
} from '@tabler/icons-react';
import FeedbackTable from '../src/table/FeedbackTable';
import ExportDropdown from '../src/components/dropdown/ExportDropdown';
import LastDayDropdown from '../src/components/dropdown/LastDaysDropdown';
import FilterDropdown from '../src/components/dropdown/FilterDropdown';
import DeleteModal from '../src/modal/DeleteModal';
import SummarizeModal from '../src/modal/SummarizeModal';
import AnalyzeModal from "../src/modal/AnalyzeModal"



const FeedBackList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSummarizeModalOpen, setIsSummarizeModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]); 
<<<<<<< HEAD
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
=======
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [analysisHistory, setAnalysisHistory] = useState([]);
>>>>>>> improvement/dashboard-feedbacklist-ui-modal
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

  const handleAnalyzeClick = () => {
    if (selectedRows.length > 0) {
      setIsAnalyzeModalOpen(true);
    }
  };
  const handleCloseAnalyzeModal = () => {
    setIsAnalyzeModalOpen(false)
  };

  const handleConfirmDelete = () => {
    setFeedbackData((prev) => prev.filter((item) => !selectedRows.includes(item.id)));
    setSelectedRows([]); 
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSummarizeClick = () => {
    setIsSummarizeModalOpen(true);
  };

  const handleCloseSummarizeModal = () => {
    setIsSummarizeModalOpen(false);
  };

  const filteredFeedbackData = feedbackData.filter((item) =>
    ['user', 'feedback', 'date', 'sentiment', 'tag', 'action'].some((key) =>
      item[key].toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // const selectedFeedbackText = feedbackData
  //   .filter((item) => selectedRows.includes(item.id))
  //   .map((item) => item.feedback)
  //   .join('\n\n');

  const selectedFeedbackText = feedbackData
  .filter((item) => selectedRows.includes(item.id))
  .map((item) => item.feedback);

  const handleSaveAnalysis = (analysis) => {
    setAnalysisHistory((prev) => [
      ...prev,
      { id: Date.now(), ...analysis },
    ]);
    setIsAnalyzeModalOpen(false); // Close modal after saving
  };


  return(
    <div className="flex min-h-screen dark:bg-[#1e2022]">
      <div className="flex-1">
        <header className="p-5 border-b border-[#e5e7eb]">
          <div className='flex items-center justify-between'>
            <div className='space-y-2.5'>
              <div className="flex items-center gap-2">
                <span className="text-[15px] text-[#64748B]">All Feedback</span>
                <span className="text-[#64748B] text-[15px]">&gt;</span>
                <span className="font-medium text-[15px] text-[#1B2124]">List</span>
              </div>
                <span className='text-[18px] text-[#1B2124] font-semibold tracking-normal'>Feedback list</span>
            </div>
            <div className='flex items-center space-x-1'>
              <ExportDropdown />
              <button 
                  onClick={toggleDrawer}
                  className='px-3 py-[9.5px] bg-white border border-[#e5e7eb] text-[#1B2124] rounded-sm hover:bg-[#F5F5F7] cursor-pointer'
                >
                  <IconHistory size={16} stroke={2} />
              </button>
            </div>
          </div>
        </header>
        <main className='p-5'>
          <div className='flex items-center  justify-between'>
            <div className='flex items-center space-x-1'>
              <div className="hidden sm:flex relative">
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-64 pl-10 pr-1 py-[7px] text-[14px] border border-[#e5e7eb] dark:border-[#2f3235] bg-white dark:bg-[#202325] text-[#1B2124] dark:text-[#EBF2F5] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] rounded-sm"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none rounded-sm">
                  <IconSearch size={15} stroke={2} className="text-[#1B2124]" />
                </div>
              </div>
              <div className='flex items-center space-x-1'>
                <LastDayDropdown />
                <FilterDropdown />
              </div> 
            </div>
            <div className='flex items-center space-x-1'>
              {selectedRows.length > 0 && (
                <span className="text-[15px] text-[#1B2124] dark:text-[#ebf2f5] mr-4">
                  {selectedRows.length} selected
                </span>
              )}
              <button 
                onClick={selectedRows.length > 0 ? handleDeleteClick : undefined}
                disabled={selectedRows.length === 0}
                className={`group flex items-center tracking-normal space-x-2 px-3 py-[7px] rounded-sm text-[14px] text-white transition-colors duration-300 bg-[#FF6363] 
                  ${
                    selectedRows.length === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-[#e55a5a] cursor-pointer'
                  }
                `}
              >
                <IconTrash size={15} stroke={2} />
                <span>Delete</span>
              </button>
              <button
                onClick={selectedRows.length > 0 ? handleSummarizeClick : undefined}
                disabled={selectedRows.length === 0} 
                className={`flex items-center tracking-normal space-x-2 px-3 py-[7px] rounded-sm 
                text-[14px] text-white transition-colors duration-300 bg-[#3385F0]
                  ${
                    selectedRows.length === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-[#2b73d1] cursor-pointer'
                  }
                `}
              >
                <IconClipboardList size={15} stroke={2} />
                <span>Summarize</span>
              </button>
              <button 
                onClick={handleAnalyzeClick}
                disabled={selectedRows.length === 0}
                className={`flex items-center tracking-normal space-x-2 px-3 py-[7px] rounded-sm text-[14px] text-white transition-colors duration-300 bg-[#22C55E]
                  ${selectedRows.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#16A34A] cursor-pointer"}`}
              >
                <IconSparkles size={15} stroke={2} />
                <span>Analyze</span>
              </button>
            </div>
          </div>
          <div className='py-8 w-full'>
            <FeedbackTable 
              feedbackData={filteredFeedbackData}
              selectedRows={selectedRows}
              onCheckboxChange={handleCheckboxChange}
              onSelectAll={handleSelectAll} 
            />
          </div>
        </main>
        <DeleteModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          message={`Are you sure you want to delete ${selectedRows.length} feedback item${selectedRows.length === 1 ? '' : 's'}? This action cannot be undone.`}
        />
         <SummarizeModal
          isOpen={isSummarizeModalOpen}
          onClose={handleCloseSummarizeModal}
          feedbackText={selectedFeedbackText.join("\n\n")}
        />
        <AnalyzeModal
          isOpen={isAnalyzeModalOpen}
          onClose={handleCloseAnalyzeModal}
          feedbackText={selectedFeedbackText}
          onSaveAnalysis={handleSaveAnalysis}
        />
      </div>
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-[#202325] shadow-lg transform transition-transform duration-300 ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-[#e5e7eb] dark:border-[#2f3235]">
            <span className="text-[18px] font-semibold text-[#1B2124] dark:text-[#EBF2F5] tracking-normal">
              Saved
            </span>
            <button
              onClick={toggleDrawer}
              className="p-2 text-[#1B2124] dark:text-[#EBF2F5] hover:bg-[#F5F5F7] dark:hover:bg-[#2f3235] rounded-full cursor-pointer"
            >
              <IconX size={15} stroke={2} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#e5e7eb] dark:border-[#2f3235]">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-3 text-[14px] text-center cursor-pointer tracking-normal transition-colors duration-200 ${
                activeTab === 'summary'
                  ? 'text-[#3385F0] border-b-2 border-[#3385F0] font-medium'
                  : 'text-[#64748B] hover:text-[#3385F0] dark:hover:text-[#EBF2F5]'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-3 text-[14px] tracking-normal cursor-pointer text-center transition-colors duration-200 ${
                activeTab === 'analytics'
                  ? 'text-[#3385F0] border-b-2 border-[#3385F0] font-medium'
                  : 'text-[#64748B] hover:text-[#3385F0] dark:hover:text-[#EBF2F5]'
              }`}
            >
              Analytics
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'analytics' ? (
            <div className="text-[#1B2124] dark:text-[#EBF2F5]">
              <h3 className="text-[16px] font-semibold mb-2">Saved Analyses</h3>
              {analysisHistory.length === 0 ? (
                <p className="text-[14px]">No analyses saved yet.</p>
              ) : (
                <ul className="space-y-2">
                  {analysisHistory.map((analysis) => (
                    <li key={analysis.id} className="text-[14px] p-2 bg-[#F9FAFB] dark:bg-[#1e2022] rounded-md">
                      <div><strong>Date:</strong> {new Date(analysis.timestamp).toLocaleString()}</div>
                      <div><strong>Topics:</strong> {analysis.topics.filter(t => t.count > 0).length} identified</div>
                      <div><strong>Sentiments:</strong> Positive: {analysis.sentiments.Positive.count}, Negative: {analysis.sentiments.Negative.count}, Neutral: {analysis.sentiments.Neutral.count}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="text-[#1B2124] dark:text-[#EBF2F5]">
              <h3 className="text-[16px] font-semibold mb-2">Summary</h3>
              <p className="text-[14px]">
                Total feedback: {feedbackData.length}, Positive: {feedbackData.filter(f => f.sentiment === 'Good').length}, Negative: {feedbackData.filter(f => f.sentiment === 'Negative').length}
              </p>
            </div>
          )}
        </div>
      </div>
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/30  z-40"
          onClick={toggleDrawer}
        ></div>
      )}
    </div>
  );
};

export default FeedBackList;