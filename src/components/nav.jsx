import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconMoon,
  IconBell,
  IconHome,
  IconClipboardList,
  IconUser,
  IconSettings,
  IconLogout,
  IconMenu2,
} from '@tabler/icons-react';
import Logo from '../assets/images/logo.png';
import Profile from '../assets/images/lebron.webp';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Home');
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRefs = useRef({});
  const containerRef = useRef(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const navigate = useNavigate();


  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Toggle hamburger menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
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

  // Close dropdown and menu on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setIsMenuOpen(false);
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

  // Update underline position and width
  useEffect(() => {
    if (activeMenu && menuRefs.current[activeMenu] && containerRef.current) {
      const menuItem = menuRefs.current[activeMenu];
      const container = containerRef.current;
      const menuRect = menuItem.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const leftOffset = menuRect.left - containerRect.left;
      const width = menuRect.width; // Use full button width (icon + text)
      setUnderlineStyle({ left: leftOffset, width });
    }
  }, [activeMenu]);

  // useEffect(() => {
  //   const path = window.location.pathname;
  //   const menuItem = navItems.find(item => item.path === path);
  //   if (menuItem) {
  //     setActiveMenu(menuItem.label);
  //   }
  // }, []);

  const navItems = [
    {
      label: 'Home',
      path: '/dashboard',
      icon: (
        <IconHome
          size={18}
          stroke={2}
          className={`transition-colors ${
            activeMenu === 'Home'
              ? 'text-[#3385F0]'
              : 'text-[#64748B] group-hover:text-[#373A40]'
          }`}
        />
      ),
    },
    {
      label: 'Feedback',
      path: '/feedback',
      icon: (
        <IconClipboardList
          size={18}
          stroke={2}
          className={`transition-colors ${
            activeMenu === 'Feedback'
              ? 'text-[#3385F0]'
              : 'text-[#64748B] group-hover:text-[#373A40]'
          }`}
        />
      ),
    },
    {
      label: 'Campaign',
      icon: (
        <IconClipboardList
          size={19}
          stroke={2}
          className={`transition-colors ${
            activeMenu === 'Campaign'
              ? 'text-[#3385F0]'
              : 'text-[#64748B] group-hover:text-[#373A40]'
          }`}
        />
      ),
    },
  ];

  return (
    <>
      <header>
        <div className="flex items-center bg-white justify-between border-b border-[#e5e7eb] px-4 py-3 sm:px-6 md:px-8 lg:px-12 xl:px-50">
          {/* Hamburger Menu (visible on sm to md) */}
          <div className="flex items-center md:hidden">
            <button onClick={toggleMenu} aria-label="Toggle menu" className='cursor-pointer'>
              <IconMenu2 size={22} stroke={2} className="text-[#1B2124]" />
            </button>
          </div>

          {/* Logo (centered on sm to md) */}
          <div className="flex justify-center flex-1 md:flex-none">
            <img src={Logo} alt="Logo" className="h-10" />
          </div>

          {/* Profile and Icons */}
          <div className="flex items-center space-x-4 md:space-x-10">
            {/* Moon and Bell Icons (hidden on sm to md) */}
            <div className="hidden md:flex items-center space-x-5">
              <IconMoon size={19} stroke={2} className="text-[#64748B]" />
              <div className="relative">
              <IconBell size={19} stroke={2} className="text-[#64748B] transition-colors" />
              {/* Notification dot positioned at top-right */}
              <span className="absolute top-[-8px] right-[-3px] flex size-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-sky-500"></span>
              </span>
            </div>
            </div>

            {/* Profile Dropdown */}
            <div className="relative inline-block">
              <button
                ref={triggerRef}
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-[#1B2124] cursor-pointer"
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                <img
                  src={Profile}
                  alt="Profile"
                  className="h-[32px] w-[32px] rounded-sm object-cover"
                />
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-[12px] font-medium tracking-normal text-[#1B2124] dark:text-[#ebf2f5]">
                    Administrator
                  </span>
                  <span className="text-[12px] tracking-normal text-[#1B2124] dark:text-[#ebf2f5]">
                    Lebron James
                  </span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 rounded-sm border border-[#C3D3DB] bg-white shadow-lg z-10 dark:border-[#2f3235] dark:bg-[#1e2022]"
                >
                  <ul className="py-1">
                    <li className="flex items-center space-x-2 border-b border-[#C3D3DB] px-3 py-2 dark:border-[#2f3235]">
                      <img
                        src={Profile}
                        alt="Profile"
                        className="h-[32px] w-[32px] rounded-full object-cover"
                      />
                      <div className="flex flex-col text-left">
                        <span className="text-[12px] font-medium tracking-normal text-[#1B2124] dark:text-[#ebf2f5]">
                          Administrator
                        </span>
                        <span className="text-[12px] tracking-normal text-[#1B2124] dark:text-[#ebf2f5]">
                          Lebron James
                        </span>
                      </div>
                    </li>
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <button
                          onClick={() => {
                            item.onClick();
                            setIsOpen(false);
                          }}
                          className="flex w-full items-center space-x-2 cursor-pointer px-4 py-2 mt-1 text-left text-[15px] text-[#1B2124] hover:bg-[#F5F5F7] focus:bg-[#F5F5F7] focus:outline-none tracking-normal dark:text-[#ebf2f5] dark:hover:bg-[#2f3235]"
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
          </div>
        </div>
      </header>

      {/* Mobile Menu (visible when hamburger is clicked) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#1e2022] px-4 py-2 border-b border-[#e5e7eb] ">
          <div className="flex flex-col space-y-4 ">
            {navItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 hover:bg-[#F5F5F7] rounded-sm">
                {item.icon}
                <span className="text-[15px] tracking-normal text-[#1B2124]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Navigation (hidden on sm to md) */}
      <nav
        className="hidden border-[#e5e7eb] bg-white md:block border-b px-4 py-4 sm:px-6 md:px-8 lg:px-12 xl:px-50 relative"
      >
        <div className="relative">
          <div ref={containerRef} className="flex items-center space-x-7 relative">
            {navItems.map((item, index) => (
              <button
                key={index}
                ref={(el) => (menuRefs.current[item.label] = el)}
                onClick={() => {
                  setActiveMenu(item.label);
                  navigate(item.path);
                  // window.location.href = item.path;
                }}                
                className={`group flex items-center space-x-2 rounded-sm cursor-pointer relative ${
                  activeMenu === item.label
                    ? 'text-[#3385F0] font-semibold'
                    : 'text-[#64748B]'
                }`}
              >
                {item.icon}
                <span
                  className={`text-[14px] tracking-normal ${
                    activeMenu === item.label
                      ? 'text-[#3385F0] font-semibold'
                      : 'text-[#64748B] group-hover:text-[#373A40] group-hover:font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
          {/* Underline as a separate element */}
          <div
            className="absolute bottom-[-17px] h-[2px] bg-[#3385F0] transition-all duration-200"
            style={{
              left: underlineStyle.left,
              width: underlineStyle.width,
            }}
          />
        </div>
      </nav>
    </>
  );
};

export default Navbar;