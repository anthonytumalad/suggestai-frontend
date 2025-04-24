import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { IconChevronDown, IconDownload, IconFileExcel, IconFileText, IconFileTypePdf } from '@tabler/icons-react';

const LastDayDropdown = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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
        <span>Last 7 days</span>
        <IconChevronDown size={16}  />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-1 w-40 bg-white border border-[#C3D3DB] rounded-sm shadow-lg z-10">
          <button
            className="flex items-center tracking-normal space-x-2 w-full text-left px-4 py-2 text-[14px] text-[#1B2124] hover:bg-[#F5F5F7]"
          >
            <span>Last 7 days</span>
          </button>
          <button
            className="flex items-center tracking-normal space-x-2 w-full text-left px-4 py-2 text-[14px] text-[#1B2124] hover:bg-[#F5F5F7]"
          >
            <span>Last 30 days</span>
          </button>
          <button
            className="flex items-center tracking-normal space-x-2 w-full text-left px-4 py-2 text-[14px] text-[#1B2124] hover:bg-[#F5F5F7]"
          >
            <span>Last 90 days</span>
          </button>
        </div>
      )}
    </div>
  );
};


export default LastDayDropdown;