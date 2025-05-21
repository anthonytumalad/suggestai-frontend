import { useState, useRef, useEffect } from 'react';
import { IconFilter, IconChevronDown } from '@tabler/icons-react';

const FilterDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [column, setColumn] = useState('Student');
  const [operator, setOperator] = useState('contains');
  const [value, setValue] = useState('');
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [isOperatorMenuOpen, setIsOperatorMenuOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const dropdownRef = useRef(null);

  const columns = ['Student', 'Feedback', 'Date', 'Sentiment', 'Tag', 'Reply'];
  const operators = ['contains', 'equals to', 'starts with', 'ends with'];

  // Close dropdown and menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsColumnMenuOpen(false);
        setIsOperatorMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

//   const handleApply = () => {
//     if (value.trim()) {
//       onApplyFilter({ column, operator, value });
//       setValue(''); // Reset input
//       setIsOpen(false); // Close dropdown
//     }
//   };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex bg-white items-center space-x-2 border text-[#1B2124] px-3 py-[7px] rounded-sm tracking-normal text-[14px] cursor-pointer ${
            isOpen ? 'bg-white text-[#3385F0] dark:bg-[#1e2022] dark:border-[#3385F0]' : 'hover:bg-[#F5F5F7] dark:bg-[#202325] dark:text-[#ebf2f5] dark:border-[#2f3235] dark:hover:bg-[#1e2022] border-[#e5e7eb]'
        }`}
      >
        <IconFilter size={15} stroke={2} />
        <span>More Filters</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-80 bg-white border border-[#e5e7eb] rounded-sm shadow-md dark:bg-[#1e2022] dark:border-[#2f3235] p-3">
          {/* Column Selection */}
          <div className="mb-3">
            <div className="relative">
              <button
                onClick={() => {
                  setIsColumnMenuOpen(!isColumnMenuOpen);
                  setIsOperatorMenuOpen(false); // Close other menu
                }}
                className={`w-full px-3 py-2 border rounded-sm dark:bg-[#1B2124] text-left flex flex-col justify-between ${
                    isColumnMenuOpen ? 'bg-[#F5F5F7] dark:bg-[#1e2022] border-[#3385F0]' : 'hover:bg-[#F5F5F7] dark:bg-[#202325]  dark:border-[#2f3235] dark:hover:bg-[#1e2022] border-[#e5e7eb]'
                }`}
              >
                <span className={`text-[12px] ${
                    isColumnMenuOpen ? 'text-[#3385F0] dark:text-[#3385F0]' : 'text-[#1B2124] dark:text-[#ebf2f5]'
                }`}>Column</span>

                <span className={`text-[15px] ${
                    isColumnMenuOpen ? 'text-[#1B2124] dark:text-[#ebf2f5]' : 'text-[#1B2124] dark:text-[#ebf2f5]'
                }`}>{column}</span>
               
                <IconChevronDown
                  size={16}
                  className={`text-[#1B2124] transition-transform duration-200 absolute right-2 top-1/2 transform -translate-y-1/2 ${
                    isColumnMenuOpen ? 'rotate-180 text-[#3385F0] dark:text-[#3385F0]' : 'text-[#1B2124] dark:text-[#ebf2f5]'
                  }`}
                />
              </button>
              {isColumnMenuOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-[#C3D3DB] rounded-sm shadow-lg dark:bg-[#1e2022] dark:border-[#2f3235] max-h-65 overflow-y-auto">
                  {columns.map((col) => (
                    <div
                      key={col}
                      onClick={() => {
                        setColumn(col);
                        setIsColumnMenuOpen(false);
                      }}
                      className="px-3 py-2 text-[15px] text-[#1B2124] hover:bg-[#F5F5F7] dark:text-[#ebf2f5] dark:hover:bg-[#2f3235] cursor-pointer my-1"
                    >
                      {col}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Operator Selection */}
          <div className="mb-3">
            <div className="relative">
              <button
                onClick={() => {
                  setIsOperatorMenuOpen(!isOperatorMenuOpen);
                  setIsColumnMenuOpen(false); // Close other menu
                }}
                className={`w-full px-3 py-2 border rounded-sm dark:bg-[#1B2124] text-left flex flex-col justify-between ${
                    isOperatorMenuOpen ? 'bg-[#F5F5F7] dark:bg-[#1e2022] border-[#3385F0]' : 'hover:bg-[#F5F5F7] dark:bg-[#202325]  dark:border-[#2f3235] dark:hover:bg-[#1e2022] border-[#e5e7eb]'
                }`}
              >
                <span className={`text-[12px] ${
                    isOperatorMenuOpen ? 'text-[#3385F0] dark:text-[#3385F0]' : 'text-[#1B2124] dark:text-[#ebf2f5]'
                }`}>Operator</span>
                <span className={`text-[15px] ${
                    isOperatorMenuOpen ? 'text-[#1B2124] dark:text-[#ebf2f5]' : 'text-[#1B2124] dark:text-[#ebf2f5]'
                }`}>{operator}</span>

                <IconChevronDown
                  size={16}
                   className={`text-[#1B2124] transition-transform duration-200 absolute right-2 top-1/2 transform -translate-y-1/2 ${
                    isOperatorMenuOpen ? 'rotate-180 text-[#3385F0] dark:text-[#3385F0]' : 'text-[#1B2124] dark:text-[#ebf2f5]'
                  }`}
                />
              </button>
              {isOperatorMenuOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-[#C3D3DB] rounded-sm shadow-lg dark:bg-[#1e2022] dark:border-[#31374a] max-h-45 overflow-y-auto">
                  {operators.map((op) => (
                    <div
                      key={op}
                      onClick={() => {
                        setOperator(op);
                        setIsOperatorMenuOpen(false);
                      }}
                      className="px-3 py-2 text-[15px] text-[#1B2124] hover:bg-[#F5F5F7] dark:text-[#ebf2f5] dark:hover:bg-[#2f3235] cursor-pointer my-1"
                    >
                      {op}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Value Input */}
          <div className="relative">
            <div className={`w-full px-3 py-2 border rounded-sm dark:bg-[#1B2124] text-[#1B2124] dark:text-[#ebf2f5] flex flex-col  ${
                isInputFocused ? 'bg-[#F5F5F7] border-[#3385F0] dark:bg-[#1e2022]' : 'hover:bg-[#F5F5F7] dark:bg-[#202325] dark:hover:bg-[#1e2022] border-[#e5e7eb] dark:border-[#31374a]'
            }`}>
                <span className={`text-[12px] ${isInputFocused ? 'text-[#3385F0]' : 'text-[#1B2124] dark:text-[#ebf2f5]'}`}>
                Value
                </span>
                <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="Enter value"
                className="w-full bg-transparent text-[15px] text-[#1B2124] dark:text-[#ebf2f5] focus:outline-none mt-1"
                />
            </div>
           </div>

          {/* Apply Button */}
          {/* <button
            onClick={handleApply}
            disabled={!value.trim()}
            className="w-full px-3 py-2 bg-[#3385F0] text-white rounded-sm hover:bg-[#2563eb] disabled:bg-[#3385F0]/50 disabled:cursor-not-allowed"
          >
            Apply Filter
          </button> */}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
