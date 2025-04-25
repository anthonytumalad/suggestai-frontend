import { useEffect, useRef, useState } from 'react';
import { IconUserCircle, IconChevronDown, IconUser, IconSettings, IconLogout } from '@tabler/icons-react';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Menu items with icons
  const menuItems = [
    {
      label: 'Profile',
      icon: <IconUser size={17} stroke={2} className="text-[#1B2124] dark:text-[#ebf2f5]" />,
      onClick: () => console.log('Profile clicked'),
    },
    {
      label: 'Settings',
      icon: <IconSettings size={17} stroke={2} className="text-[#1B2124] dark:text-[#ebf2f5]" />,
      onClick: () => console.log('Settings clicked'),
    },
    {
      label: 'Logout',
      icon: <IconLogout size={17} stroke={2} className="text-[#1B2124] dark:text-[#ebf2f5]" />,
      onClick: () => console.log('Logout clicked'),
    },
  ];

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-[#1B2124] cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <IconUserCircle size={35} stroke={1} className='text-[#1B2124] dark:text-[#ebf2f5]'/>
        <div className="flex flex-col text-left">
          <span className="text-[#1B2124] text-[12px] font-medium tracking-normal dark:text-[#ebf2f5]">Administrator</span>
          <span className="text-[#1B2124] text-[12px] tracking-normal dark:text-[#ebf2f5]">John Doe</span>
        </div>
        <IconChevronDown
          size={16}
          className="text-[#1B2124] transition-transform duration-200 dark:text-white"  
          //{`text-[#1B2124] transition-transform duration-200 dark:text-white ${isOpen ? 'rotate-180' : ''`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 bg-white border border-[#C3D3DB] rounded-sm shadow-lg z-10  dark:bg-[#1e2022] dark:border-[#2f3235]"
        >
          <ul className="py-1">
            <li className='flex items-center space-x-2 px-3 py-2 border-b border-[#C3D3DB] dark:border-[#2f3235]'>
                <IconUserCircle size={35} stroke={1} className='text-[#1B2124] dark:text-[#ebf2f5]' />
                <div className="flex flex-col text-left">
                    <span className="text-[#1B2124] text-[12px] font-medium tracking-normal dark:text-[#ebf2f5]">Administrator</span>
                    <span className="text-[#1B2124] text-[12px] tracking-normal dark:text-[#ebf2f5]">John Doe</span>
                </div>            
            </li>
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left px-4 py-2 mt-1 text-[15px] text-[#1B2124] hover:bg-[#F5F5F7] focus:outline-none focus:bg-[#F5F5F7] tracking-normal dark:text-[#ebf2f5] dark:hover:bg-[#2f3235] cursor-pointer"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;