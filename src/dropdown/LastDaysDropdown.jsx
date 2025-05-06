import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { IconChevronDown } from '@tabler/icons-react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css'; // Theme CSS file
import '../css/dateRangePickerDarkMode.css'
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const LastDayDropdown = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Today');
  const [customRangeOpen, setCustomRangeOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const dropdownRef = useRef(null);

  // Helper function to format date range for display
  const getDisplayRange = () => {
    const today = new Date();
    switch (selectedRange) {
      case 'Today':
        return `${format(today, 'MMM d')} - ${format(today, 'MMM d, yyyy')}`;
      case 'Yesterday': {
        const yesterday = subDays(today, 1);
        return `${format(yesterday, 'MMM d')} - ${format(yesterday, 'MMM d, yyyy')}`;
      }
      case 'Last 7 days': {
        const start = subDays(today, 6);
        return `${format(start, 'MMM d')} - ${format(today, 'MMM d, yyyy')}`;
      }
      case 'Last 30 days': {
        const start = subDays(today, 29);
        return `${format(start, 'MMM d')} - ${format(today, 'MMM d, yyyy')}`;
      }
      case 'This Month': {
        const start = startOfMonth(today);
        const end = endOfMonth(today);
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
      }
      case 'Last Month': {
        const lastMonthStart = startOfMonth(subMonths(today, 1));
        const lastMonthEnd = endOfMonth(subMonths(today, 1));
        return `${format(lastMonthStart, 'MMM d')} - ${format(lastMonthEnd, 'MMM d, yyyy')}`;
      }
      case 'Custom Range':
        return `${format(dateRange.startDate, 'MMM d')} - ${format(dateRange.endDate, 'MMM d, yyyy')}`;
      default:
        return 'Select Range';
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setCustomRangeOpen(false); // Close calendar when toggling dropdown
  };

  const handleSelectRange = (range) => {
    setSelectedRange(range);
    setIsOpen(false);
    if (range !== 'Custom Range') {
      setCustomRangeOpen(false);
    }
  };

  const handleCustomRangeClick = () => {
    setSelectedRange('Custom Range');
    setCustomRangeOpen(true);
  };

  const handleDateRangeSelect = (ranges) => {
    setDateRange(ranges.selection);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setCustomRangeOpen(false);
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
        className={`flex items-center space-x-2 border text-[#1B2124] px-3 py-2 rounded-sm tracking-normal text-[15px] cursor-pointer ${
          isOpen
            ? 'bg-[#F5F5F7] text-[#3385F0] dark:bg-[#1e2022] dark:border-[#3385F0]'
            : 'hover:bg-[#F5F5F7] dark:bg-[#202325] dark:text-[#ebf2f5] dark:border-[#2f3235] dark:hover:bg-[#1e2022] border-[#C3D3DB]'
        }`}
      >
        <span>{getDisplayRange()}</span>
        <IconChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen && 'rotate-180 text-[#3385F0]'}`}
          stroke={2}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-1 w-40 bg-white border border-[#C3D3DB] rounded-sm shadow-lg z-10 dark:bg-[#1e2022] dark:border-[#2f3235]">
          <button
            onClick={() => handleSelectRange('Today')}
            className="flex items-center mt-1 tracking-normal space-x-2 w-full text-left px-4 py-2 text-[15px] text-[#1B2124] hover:bg-[#F5F5F7] dark:text-[#ebf2f5] dark:hover:bg-[#2f3235]"
          >
            <span>Today</span>
          </button>
          <button
            onClick={() => handleSelectRange('Yesterday')}
            className="flex items-center tracking-normal space-x-2 w-full text-left px-4 py-2 text-[15px] text-[#1B2124] hover:bg-[#F5F5F7] dark:text-[#ebf2f5] dark:hover:bg-[#2f3235]"
          >
            <span>Yesterday</span>
          </button>
          <button
            onClick={() => handleSelectRange('Last 7 days')}
            className="flex items-center tracking-normal space-x-2 w-full text-left px-4 py-2 text-[15px] text-[#1B2124] hover:bg-[#F5F5F7] dark:text-[#ebf2f5] dark:hover:bg-[#2f3235]"
          >
            <span>Last 7 days</span>
          </button>
          <button
            onClick={() => handleSelectRange('Last 30 days')}
            className="flex items-center tracking-normal space-x-2 w-full text-left px-4 py-2 text-[15px] text-[#1B2124] hover:bg-[#F5F5F7] dark:text-[#ebf2f5] dark:hover:bg-[#2f3235]"
          >
            <span>Last 30 days</span>
          </button>
          <button
            onClick={() => handleSelectRange('This Month')}
            className="flex items-center tracking-normal space-x-2 w-full text-left px-4 py-2 text-[15px] text-[#1B2124] hover:bg-[#F5F5F7] dark:text-[#ebf2f5] dark:hover:bg-[#2f3235]"
          >
            <span>This Month</span>
          </button>
          <button
            onClick={() => handleSelectRange('Last Month')}
            className="flex items-center tracking-normal space-x-2 w-full text-left px-4 py-2 text-[15px] text-[#1B2124] hover:bg-[#F5F5F7] dark:text-[#ebf2f5] dark:hover:bg-[#2f3235]"
          >
            <span>Last Month</span>
          </button>
          <button
            onClick={handleCustomRangeClick}
            className="flex items-center mb-1 tracking-normal space-x-2 w-full text-left px-4 py-2 text-[15px] text-[#1B2124] hover:bg-[#F5F5F7] dark:text-[#ebf2f5] dark:hover:bg-[#2f3235]"
          >
            <span>Custom Range</span>
          </button>
        </div>
      )}
      {customRangeOpen && (
        <div className="absolute left-0 mt-1 bg-white border border-[#C3D3DB] rounded-sm shadow-lg z-10 dark:bg-[#1e2022] dark:border-[#2f3235]">
          <DateRangePicker
            ranges={[dateRange]}
            onChange={handleDateRangeSelect}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
          />
        </div>
      )}
    </div>
  );
};

LastDayDropdown.propTypes = {
  onExport: PropTypes.func,
};

export default LastDayDropdown;