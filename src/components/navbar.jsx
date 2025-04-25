import { useState, useEffect } from 'react';
import { 
  IconMenu2, 
  IconBell,
  IconMoon,
  IconSun,
  IconSettings,
} from '@tabler/icons-react';
import ProfileDropdown from '../dropdown/ProfileDropdown';

const TopNav = ({ isCollapsed, onToggle }) => {
  const [isSunMode, setIsSunMode] = useState(true);

  useEffect(() => {
    if (isSunMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [isSunMode]);
  
  const toggleSunMoon = () => {
    setIsSunMode(!isSunMode);
  };
  
  return (
    <div
      className={`fixed top-0 left-0 right-0 h-16 bg-white border-y border-[#C3D3DB] z-1 flex items-center transition-all duration-300 dark:bg-[#202325] dark:border-[#2f3235] ${
        isCollapsed ? 'pl-[80px]' : 'pl-[260px]'
      }`}
    >
      <div className="flex items-center w-full justify-between px-8">
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="p-2 hover:bg-[#F5F5F7] rounded-sm dark:hover:bg-[#2f3235] cursor-pointer"
        >
          <IconMenu2 size={20} stroke={1} className='text-[#1B2124] dark:text-[#ebf2f5]' />
        </button>
        
        <div className='flex items-center space-x-5'>
          <div className='items-center space-x-2'>
            <button
              aria-label="Settings"
              className="p-2 hover:bg-[#F5F5F7] dark:hover:bg-[#2f3235] rounded-full cursor-pointer"
            >
              <IconSettings size={20} stroke={1} className='text-[#1B2124] dark:text-[#ebf2f5]' />
            </button>
            <button
              onClick={toggleSunMoon}
              aria-label={isSunMode ? 'Switch to moon icon' : 'Switch to sun icon'}
              className="p-2 hover:bg-[#F5F5F7] dark:hover:bg-[#2f3235] rounded-full cursor-pointer"
            >
              {isSunMode ? (
                <IconSun size={20} stroke={1} color='#1B2124' />
              ) : (
                <IconMoon size={20} stroke={1} className='text-[#1B2124] dark:text-[#ebf2f5]'/>
              )}
            </button>
            <button
              aria-label="Notifications" 
              className="p-2  rounded-full cursor-pointer"
            >
              <IconBell size={20} stroke={1} className='text-[#1B2124] dark:text-[#ebf2f5]' />
            </button>
          </div>
          {/* <div className="flex items-center space-x-2">
            <IconUserCircle size={30} stroke="#1B2124" />
            <div className="flex flex-col">
              <span className="text-[#1B2124] text-[12px]">Administrator</span>
              <span className="text-[#1B2124] text-[12px]">John Doe</span>
            </div>
            <IconChevronDown size={16} className='text-[#1B2124]' />
          </div> */}
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
};

export default TopNav;