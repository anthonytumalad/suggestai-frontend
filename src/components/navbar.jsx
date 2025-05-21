import { useState, useEffect } from 'react';
import {
  IconMenu2,
  IconBell,
  IconMoon,
  IconSun,
  IconMaximize,
} from '@tabler/icons-react';
import ProfileDropdown from './dropdown/ProfileDropdown';

const TopNav = ({ isDrawerOpen, onDrawerToggle }) => {
  const [isSunMode, setIsSunMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'light' : true;
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isSunMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, [isSunMode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const toggleSunMoon = () => {
    setIsSunMode((prev) => !prev);
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-14 bg-[#f9fafb] border-b border-[#e5e7eb] z-15 flex items-center transition-all duration-300 dark:bg-[#202325] dark:border-[#2f3235]`}
    >
      <div className="flex items-center w-full justify-between px-4">
        <button
          onClick={onDrawerToggle}
          aria-label="Toggle sidebar"
          className="p-1 hover:bg-[#F5F5F7] rounded-sm dark:hover:bg-[#2f3235] cursor-pointer"
        >
          <IconMenu2
            size={18}
            stroke={1.5}
            className="text-[#1B2124] dark:text-[#ebf2f5]"
          />
        </button>

        <div className="flex items-center space-x-5">
          <div className="items-center space-x-2">
            <button
              onClick={toggleSunMoon}
              aria-label={isSunMode ? 'Switch to moon icon' : 'Switch to sun icon'}
              className="p-2 hover:bg-[#F5F5F7] dark:hover:bg-[#2f3235] rounded-full cursor-pointer"
            >
              {isSunMode ? (
                <IconMoon size={17} stroke={1.5} color="#1B2124" />
              ) : (
                <IconSun
                  size={17}
                  stroke={1.5}
                  className="text-[#1B2124] dark:text-[#ebf2f5]"
                />
              )}
            </button>
            <button
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="p-2 hover:bg-[#F5F5F7] dark:hover:bg-[#2f3235] rounded-full cursor-pointer"
            >
              <IconMaximize
                size={17}
                stroke={1.5}
                className="text-[#1B2124] dark:text-[#ebf2f5]"
              />
            </button>
            <button
              aria-label="Notifications"
              className="p-2 rounded-full cursor-pointer"
            >
              <IconBell
                size={17}
                stroke={1.5}
                className="text-[#1B2124] dark:text-[#ebf2f5]"
              />
            </button>
          </div>
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
};

export default TopNav;