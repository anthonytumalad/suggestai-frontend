import { useState } from 'react';
import { 
  IconMenu2, 
  IconUserCircle, 
  IconBell,
  IconMoon,
  IconSun,
  IconSettings
} from '@tabler/icons-react';

const TopNav = ({ isCollapsed, onToggle }) => {
  const [isSunMode, setIsSunMode] = useState(true);
  
  const toggleSunMoon = () => {
    setIsSunMode(!isSunMode);
  };
  
  return (
    <div
      className={`fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#\(\) border-[#C3D3DB] z-0 flex items-center transition-all duration-300 ${
        isCollapsed ? 'pl-[80px]' : 'pl-[260px]'
      }`}
    >
      <div className="flex items-center w-full justify-between px-8">
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="p-2 hover:bg-[#F5F5F7] rounded-md"
        >
          <IconMenu2 size={20} stroke="#1B2124" />
        </button>
        
        <div className='flex items-center space-x-5'>
          <div className='items-center space-x-2'>
            <button
              aria-label="Settings"
              className="p-2 hover:bg-[#3385F0]/20 hover:text-[#3385F0] rounded-full cursor-pointer"
            >
              <IconSettings size={20} stroke="#1B2124" />
            </button>
            <button
              onClick={toggleSunMoon}
              aria-label={isSunMode ? 'Switch to moon icon' : 'Switch to sun icon'}
              className="p-2 hover:bg-[#3385F0]/20 hover:text-[#3385F0] rounded-full cursor-pointer"
            >
              {isSunMode ? (
                <IconSun size={20} stroke="#1B2124" />
              ) : (
                <IconMoon size={20} stroke="#1B2124" />
              )}
            </button>
            <button
              aria-label="Notifications" 
              className="p-2 hover:bg-[#3385F0]/20 hover:text-[#3385F0] rounded-full cursor-pointer"
            >
              <IconBell size={20} stroke="#1B2124" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <IconUserCircle size={28} stroke="#1B2124" />
            <span className="text-[#1B2124] text-base font-medium">John Doe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;