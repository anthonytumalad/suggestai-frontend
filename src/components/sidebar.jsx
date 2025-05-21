import {
  IconListDetails,
  IconX,
  IconMail,
} from '@tabler/icons-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const SideBar = ({ isDrawerOpen, onCloseDrawer, onSubSidebarChange }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [

    {
      label: 'All Feeback',
      icon: IconListDetails,
      path: '/feedback_list',
      subItems: [
        { label: 'Overview', path: '/dashboard' },
        { label: 'List', path: '/feedback_list' },
        // { label: 'Summarizer', path: '/feedback_summary' },
      ],
    },
  
  ];

  const activeMainItem = menuItems.find(
    (item) =>
      location.pathname === item.path ||
      (item.subItems &&
        item.subItems.some((subItem) => subItem.path === location.pathname))
  );

  const isSubSidebarVisible = activeMainItem && activeMainItem.subItems?.length > 0;
  onSubSidebarChange?.(isSubSidebarVisible);

  const handleMainItemClick = (item) => {
    if (item.path === location.pathname) return;
    navigate(item.path);
    onCloseDrawer();
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen z-20 transition-all duration-300 flex
          ${!isDrawerOpen && '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Main Sidebar (Icons Only) */}
        <div className="h-screen bg-[#fff] border-r border-[#e5e7eb] text-black dark:bg-[#202325] dark:border-[#2f3235] dark:text-[#ebf2f5] w-[80px]">
          <nav className="flex flex-col h-full items-center">
            {/* <div className="px-6 mt-5 mb-4">
              <IconPencil size={30} className="text-[#1B2124] dark:text-[#ebf2f5]" />
              
            </div> */}

            <ul className="space-y-2 flex-1 mt-5">
              {menuItems.map((item, index) => (
                <li key={index} className="relative group">
                  <NavLink
                    to={item.path}
                    onClick={() => handleMainItemClick(item)}
                    className={({ isActive }) =>
                      `flex items-center justify-center px-3 py-2 rounded-sm ${
                        isActive ||
                        (item.subItems &&
                          item.subItems.some(
                            (subItem) => subItem.path === location.pathname
                          ))
                          ? 'bg-[#3385F0]/10 text-[#3385F0]'
                          : 'hover:bg-[#F5F5F7] text-[#1B2124] dark:hover:bg-[#2f3235] dark:text-[#ebf2f5]'
                      } transition-colors duration-200 w-full`
                    }
                  >
                    <item.icon
                      size={20}
                      stroke={1.5}
                      className={
                        location.pathname === item.path ||
                        (item.subItems &&
                          item.subItems.some(
                            (subItem) => subItem.path === location.pathname
                          ))
                          ? 'text-[#3385F0]'
                          : 'text-[#1B2124] dark:text-[#ebf2f5]'
                      }
                    />
                  </NavLink>
                  <span
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-1 bg-[#1B2124] text-white dark:bg-[#EBF2F5] dark:text-[#1B2124] text-[12px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 whitespace-nowrap"
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Sub Sidebar */}
        {isSubSidebarVisible && (
          <div className="h-screen bg-[#f6f8fb] border-r border-[#e5e7eb] dark:border-[#2f3235] dark:text-[#ebf2f5] w-[220px]">
            <nav className="flex flex-col h-full">
              <div className="px-4 py-5 text-[#3385F0] dark:text-[#ebf2f5] font-medium text-[15px] tracking-wide flex justify-between">
                {activeMainItem.label}
                {isDrawerOpen && (
                <button
                  onClick={onCloseDrawer}
                  className="lg:hidden  rounded-lg hover:bg-[#F5F5F7] dark:hover:bg-[#2f3235] transition-colors cursor-pointer"
                >
                  <IconX size={18} className="text-[#1B2124] dark:text-[#ebf2f5]" />
                </button>
              )}
              </div>

              <ul className="">
                {activeMainItem.subItems.map((subItem, index) => (
                  <li key={index} className="relative">
                    <NavLink
                      to={subItem.path}
                      className={({ isActive }) =>
                        `flex items-center w-full py-1 ${
                          isActive ||
                          (subItem.path === '/dashboard' &&
                            location.pathname === '/dashboard')
                            ? 'bg-white text-[#3385F0] font-medium border-l-2 border-[#3385F0] '
                            : 'text-[#1B2124] dark:text-[#ebf2f5] hover:bg-white hover:text-[#3385F0]'
                        } transition-colors duration-500`
                      }
                    >
                      <span className="px-4 py-1 w-full text-[15px] tracking-normal">
                        {subItem.label}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </>
  );
};

export default SideBar;