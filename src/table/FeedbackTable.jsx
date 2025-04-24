import { useState } from 'react';
import PropTypes from 'prop-types';
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconDotsVertical } from '@tabler/icons-react';

const FeedbackTable = ({ feedbackData }) => {
  const [selectedRows, setSelectedRows] = useState([]);
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

  const getTagBadge = (tag) => {
    const styles = {
      UI: 'bg-blue-100 text-blue-800',
      UX: 'bg-purple-100 text-purple-800',
    };
    return (
      <span
        className={`inline-block px-2 py-1 text-[12px] font-medium rounded-full ${
          styles[tag] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {tag}
      </span>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-[#C3D3DB] bg-white">
          <thead>
            <tr className="bg-[#F5F5F7]">
              <th className="p-1 w-12">
                <input
                  type="checkbox"
                  onChange={() => {
                    if (selectedRows.length === paginatedData.length) {
                      setSelectedRows([]);
                    } else {
                      setSelectedRows(paginatedData.map((row) => row.id));
                    }
                  }}
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                />
              </th>
              <th className="p-3 text-left">STUDENT</th>
              <th className="p-5 text-left">FEEDBACK</th>
              <th className="p-5 text-left">DATE</th>
              <th className="p-5 text-left">SENTIMENT</th>
              <th className="p-5 text-left">TAG</th>
              <th className="p-5 text-left">REPLY</th>
              <th className="p-5 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-[#F5F5F7]/50">
                <td className="p-5 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleCheckboxChange(row.id)}
                  />
                </td>
                <td className="p-3">{row.user}</td>
                <td className="p-5 max-w-[370px]">{row.feedback}</td>
                <td className="p-5">{row.date}</td>
                <td className="p-5">{getSentimentBadge(row.sentiment)}</td>
                <td className="p-5">{getTagBadge(row.tag)}</td>
                <td className="p-5 max-w-[380px]">{row.reply}</td>
                <td className="p-5 items-center justify-center text-center">
                    <IconDotsVertical size={16} color="#1B2124" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-3 bg-[#F5F5F7] border-b border-x border-[#C3D3DB]">
        <div className="flex items-center space-x-2">
          <span className="text-[14px] tracking-[0.5px] text-[#1B2124]">
            Showing {startIndex + 1}-{endIndex} of {totalRows}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="appearance-none bg-white border border-[#C3D3DB] text-[#1B2124] text-[14px] pl-3 pr-8 py-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#3385F0]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2">
              <IconChevronDown size={14} color="#1B2124" />
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center tracking-[0.5px] space-x-1 px-2 py-1 border border-[#C3D3DB] rounded-sm text-[14px] ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#1B2124] hover:bg-[#3385F0]/20 hover:text-[#3385F0]'
              }`}
            >
              <IconChevronLeft size={14} />
              <span>Previous</span>
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center tracking-[0.5px] space-x-1 px-2 py-1 border border-[#C3D3DB] rounded-sm text-[14px] ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#1B2124] hover:bg-[#3385F0]/20 hover:text-[#3385F0]'
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
      tag: PropTypes.oneOf(['UI', 'UX']).isRequired,
      reply: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FeedbackTable;