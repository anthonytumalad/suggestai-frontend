import { useState } from 'react';
import PropTypes from 'prop-types';
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconDotsVertical, IconMoodEmpty } from '@tabler/icons-react';

const FeedbackTable = ({ feedbackData, selectedRows, onCheckboxChange, onSelectAll }) => {
  // const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleAction = (action, row) => {
    console.log(`${action} for row:`, row);
    setOpenMenuId(null); 
  };

  const totalRows = feedbackData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const paginatedData = feedbackData.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const getSentimentBadge = (sentiment) => {
    const styles = {
      Negative: 'bg-[#FF6363]/20 text-[#FF6363]',
      Good: 'bg-green-100 text-green-800',
      Neutral: 'bg-gray-100 text-gray-800',
    };
    return (
      <span
        className={`inline-block px-2 py-1 text-[12px] rounded-sm ${
          styles[sentiment] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {sentiment}
      </span>
    );
  };


  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-[#C3D3DB] bg-white dark:bg-[#202325] dark:border-[#2f3235]">
          <thead className=''>
            <tr className="bg-[#F5F5F7] border-b border-[#C3D3DB] dark:bg-[#1e2022] dark:border-[#2f3235]">
              <th className="p-1 w-12 ">
              <input
                  type="checkbox"
                  onChange={() => onSelectAll(paginatedData)}
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  className='accent-[#3385F0]'
                />
              </th>
              <th className="p-3 text-left"><span className='text-[14px] tracking-normal text-[#1B2124] dark:text-[#ebf2f5]'>STUDENT</span></th>
              <th className="p-5 text-left"><span className='text-[14px] tracking-normal text-[#1B2124] dark:text-[#ebf2f5]'>FEEDBACK</span></th>
              <th className="p-5 text-left"><span className='text-[14px] tracking-normal text-[#1B2124] dark:text-[#ebf2f5]'>DATE</span></th>
              <th className="p-5 text-left"><span className='text-[14px] tracking-normal text-[#1B2124] dark:text-[#ebf2f5]'>SENTIMENT</span></th>
              <th className="p-5 text-left"><span className='text-[14px] tracking-normal text-[#1B2124] dark:text-[#ebf2f5]'>REPLY</span></th>
              <th className="p-5 text-center"><span className='text-[14px] tracking-normal text-[#1B2124] dark:text-[#ebf2f5]'>ACTION</span></th>
            </tr>
          </thead>
          <tbody>
          {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-5 text-center">
                  <div className="flex flex-col items-center justify-center py-10">
                    <IconMoodEmpty size={48} className="text-[#64748B] dark:text-[#ebf2f5] mb-2" />
                    <span className="text-[14px] text-[#64748B] dark:text-[#ebf2f5]">No Data Found</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                key={row.id}
                className={`transition-colors duration-200 ${
                  selectedRows.includes(row.id) ? 'bg-[#3385F0]/10 dark:bg-[#3385F0]/10' : 'hover:bg-[#F5F5F7] dark:hover:bg-[#1e2022]'
                }`}
              >
                  <td className="p-5 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => onCheckboxChange(row.id)}
                    />
                  </td>
                  <td className="p-3"><span className='text-[#1B2124] dark:text-[#ebf2f5] text-[14px] tracking-wide'>{row.user}</span></td>
                  <td className="p-5 max-w-[370px]"><span className='text-[#1B2124] dark:text-[#ebf2f5] text-[14px] tracking-wide'>{row.feedback}</span></td>
                  <td className="p-5"><span className='text-[#1B2124] dark:text-[#ebf2f5] text-[14px] tracking-wide'>{row.date}</span></td>
                  <td className="p-5"><span className='text-[#1B2124] dark:text-[#ebf2f5] text-[14px] tracking-wide'>{getSentimentBadge(row.sentiment)}</span></td>
                  <td className="p-5 max-w-[380px]"><span className='text-[#1B2124] dark:text-[#ebf2f5] text-[14px] tracking-wide'>{row.reply}</span></td>
                  <td className="pl-9">
                      <IconDotsVertical size={16} stroke={2} className='hover:bg-[#3385F0]/20 hover:text-[#3385F0]'/>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-3 bg-[#F5F5F7] border-b border-x border-[#C3D3DB]
      dark:bg-[#1e2022] dark:border-[#2f3235]">
        <div className="flex items-center space-x-2">
          <span className="text-[14px] tracking-[0.5px] text-[#1B2124] dark:text-[#ebf2f5]">
            Showing {startIndex + 1}-{endIndex} of {totalRows}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="appearance-none bg-white dark:bg-[#1e2022] dark:text-[#ebf2f5] border border-[#C3D3DB] text-[#1B2124] text-[14px] pl-3 pr-8 py-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#3385F0] dark:border-[#2f3235]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2">
              <IconChevronDown size={14} stroke={2} className='text-[#1B2124] dark:text-[#ebf2f5]' />
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center dark:bg-[#1e2022] dark:border-[#2f3235] tracking-[0.5px] space-x-1 px-2 py-1 border border-[#C3D3DB] rounded-sm text-[14px] ${
                currentPage === 1
                  ? 'text-gray-400 bg-[#F5F5F7]/50 cursor-not-allowed'
                  : 'text-[#1B2124] dark:text-[#ebf2f5] hover:border-[#3385F0] hover:text-[#3385F0]'
              }`}
            >
              <IconChevronLeft size={14} />
              <span>Previous</span>
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center dark:bg-[#1e2022] dark:border-[#2f3235] tracking-[0.5px] space-x-1 px-2 py-1 border border-[#C3D3DB] rounded-sm text-[14px] ${
                currentPage === totalPages
                  ? 'text-gray-400 bg-[#F5F5F7]/50 cursor-not-allowed'
                  : 'text-[#1B2124] dark:text-[#ebf2f5] hover:border-[#3385F0] hover:text-[#3385F0]'
              }`}
            >
              <span>Next</span>
              <IconChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

FeedbackTable.propTypes = {
  feedbackData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.string.isRequired,
      feedback: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      sentiment: PropTypes.oneOf(['Negative', 'Good', 'Neutral']).isRequired,
      reply: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
    })
  ).isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,

};

export default FeedbackTable;