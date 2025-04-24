import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { IconChevronDown, IconDownload, IconFileExcel, IconFileText, IconFileTypePdf } from '@tabler/icons-react';

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
        className={`flex items-center space-x-2 border text-[#1B2124] border-[#C3D3DB] px-3 py-2 rounded-sm tracking-normal text-[15px] cursor-pointer ${
            isOpen ? 'bg-[#3385F0]/20 text-[#3385F0]' : 'hover:bg-[#3385F0]/20 hover:text-[#3385F0]'
        }`}
      >
        <IconDownload size={16} />
        <span>Export</span>
        <IconChevronDown size={16}  />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-1 w-40 bg-white border border-[#C3D3DB] rounded-sm shadow-lg z-10">
          <div className='text-[14px] px-4 py-2 tracking-normal border-b border-[#C3D3DB] text-[#1B2124]'>
            <span>Download Options</span>
          </div>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center tracking-normal space-x-2 w-full text-left px-4 py-2 text-[14px] text-[#1B2124] hover:bg-[#F5F5F7]"
          >
            <IconFileExcel size={16} color="#217346" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center tracking-normal space-x-2 w-full text-left px-4 py-2 text-[14px] text-[#1B2124] hover:bg-[#F5F5F7]"
          >
            <IconFileText size={16} color="#6B7280" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center tracking-normal space-x-2 w-full text-left px-4 py-2 text-[14px] text-[#1B2124] hover:bg-[#F5F5F7]"
          >
            <IconFileTypePdf size={16} color="#D32F2F" />
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