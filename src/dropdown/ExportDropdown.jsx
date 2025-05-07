import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { IconChevronDown, IconDownload, IconFileSpreadsheet, IconFileText, IconFileTypePdf } from '@tabler/icons-react';

const ExportDropdown = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleExport = (format) => {
    onExport(format);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center space-x-2 border px-3 py-2 rounded-sm tracking-normal text-[15px] cursor-pointer  ${
            isOpen ? 'bg-[#F5F5F7] text-[#3385F0] dark:bg-[#1e2022] dark:border-[#3385F0]' : 'hover:bg-[#F5F5F7] dark:bg-[#202325] dark:text-[#ebf2f5] dark:border-[#2f3235] dark:hover:bg-[#1e2022] border-[#C3D3DB] text-[#1B2124]'
        }`}
      >
        <IconDownload size={16} stroke={2} />
        <span>Export</span>
        <IconChevronDown 
          size={16}
          className={`transition-transform duration-200  ${isOpen && 'rotate-180 text-[#3385F0]'}`}
          stroke={2}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-1 w-42 bg-white border border-[#C3D3DB] rounded-sm shadow-lg z-10 dark:bg-[#1e2022] dark:border-[#2f3235]">
          <div className='text-[12px] px-4 py-2 tracking-normal uppercase font-semibold text-[#1B2124] dark:text-[#ebf2f5]'>
            <span>Download Options</span>
          </div>
          <button
            onClick={() => handleExport('excel')}
            className="flex  items-center tracking-normal space-x-2 w-full text-left px-4 py-2 text-[15px] text-[#1B2124] hover:bg-[#F5F5F7] dark:text-[#ebf2f5] dark:hover:bg-[#2f3235]"
          >
            <IconFileSpreadsheet size={17} color="#217346" stroke={2} />
            <span>Excel</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center tracking-normal space-x-2 w-full text-left px-4 py-2 text-[15px] text-[#1B2124] hover:bg-[#F5F5F7] dark:text-[#ebf2f5] dark:hover:bg-[#2f3235]"
          >
            <IconFileText size={17} color="#6B7280" stroke={2} />
            <span>.CSV</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex mb-1 items-center tracking-normal space-x-2 w-full text-left px-4 py-2 text-[15px] text-[#1B2124] hover:bg-[#F5F5F7] dark:text-[#ebf2f5] dark:hover:bg-[#2f3235]"
          >
            <IconFileTypePdf size={17} color="#FF6363" stroke={2} />
            <span>PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};

ExportDropdown.propTypes = {
  onExport: PropTypes.func.isRequired,
};

export default ExportDropdown;