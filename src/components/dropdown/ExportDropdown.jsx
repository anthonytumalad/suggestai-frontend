import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  IconChevronDown,
  IconDownload,
  IconFileExcel,
  IconFileText,
  IconFileTypePdf,
} from '@tabler/icons-react';

const ExportDropdown = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const exportOptions = [
    {
      format: 'excel',
      label: 'Excel',
      icon: IconFileExcel,
      color: '#217346',
    },
    {
      format: 'csv',
      label: '.CSV',
      icon: IconFileText,
      color: '#6B7280',
    },
    {
      format: 'pdf',
      label: 'PDF',
      icon: IconFileTypePdf,
      color: '#FF6363',
    },
  ];

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
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
        className={`flex items-center bg-white space-x-2 border px-3 py-[7px] rounded-sm tracking-normal text-[14px] cursor-pointer ${
          isOpen
            ? 'bg-white text-[#3385F0] dark:bg-[#1e2022] dark:border-[#3385F0]'
            : 'hover:bg-[#F5F5F7] dark:bg-[#202325] dark:text-[#ebf2f5] dark:border-[#2f3235] dark:hover:bg-[#1e2022] border-[#e5e7eb] text-[#1B2124]'
        }`}
      >
        <IconDownload size={15} stroke={2} />
        <span>Export</span>
        <IconChevronDown
          size={13}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#3385F0]' : ''}`}
          stroke={2}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-1 w-42 bg-white border border-[#e5e7eb] rounded-sm shadow-md z-10 dark:bg-[#1e2022] dark:border-[#2f3235]">
          <div className="text-[12px] px-3 py-2 tracking-normal uppercase font-semibold text-[#64748B] dark:text-[#ebf2f5]">
            Download Options
          </div>
          {exportOptions.map(({ format, label, icon: Icon, color }) => (
            <button
              key={format}
              onClick={() => handleExport(format)}
              className="flex items-center tracking-normal space-x-2 w-full text-left px-3 py-2 text-[15px] text-[#1B2124] hover:bg-[#F5F5F7] dark:text-[#ebf2f5] dark:hover:bg-[#2f3235] mb-1"
            >
              <Icon size={15} color={color} stroke={2} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

ExportDropdown.propTypes = {
  onExport: PropTypes.func.isRequired,
};

export default ExportDropdown;