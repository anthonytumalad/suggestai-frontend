import { useState } from 'react';
import {
  IconHome,
  IconClipboardList,
  IconSettings,
  IconInfoCircle,
  IconPencil,
  IconX,
} from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/images/logo.png';

const SideBar = ({ collapsed, isDrawerOpen, onCloseDrawer }) => {
  const menuItems = [
    {
      label: 'Home',
      icon: IconHome,
      path: '/dashboard',
    },
    {
      label: 'Feedback',
      icon: IconClipboardList,
      path: '/feedback_list',
    },
    {
      label: 'Campaign',
      icon: IconSettings,
      path: '/settings',
    },
    {
      label: 'Task',
      icon: IconInfoCircle,
      path: '/about',
    },
  ];

  return (
    <>
      {/* Backdrop for drawer on sm to md */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onCloseDrawer}
        ></div>
      )}

      {/* Sidebar/Drawer */}
      <div
        className={`fixed top-0 left-0 h-screen bg-[#f6f8fb] border-r border-[#e5e7eb] text-black z-20 transition-all duration-300 dark:bg-[#202325] dark:border-[#2f3235] dark:text-[#ebf2f5] 
          ${
            isDrawerOpen
              ? 'w-[260px] translate-x-0'
              : collapsed
              ? 'w-[80px]'
              : 'w-[260px]'
          }
          lg:${collapsed ? 'w-[80px]' : 'w-[260px]'}
          ${!isDrawerOpen && '-translate-x-full lg:translate-x-0'}
        `}
      >
        <nav
          className={`${
            isDrawerOpen || !collapsed ? '' : 'items-center'
          } flex flex-col h-full`}
        >
          {/* Logo Section */}
          <div
            className={`${
              isDrawerOpen || !collapsed ? 'justify-between' : 'justify-center'
            } flex items-center px-6 mt-3 mb-5`}
          >
            {isDrawerOpen || !collapsed ? (
              <img src={Logo} alt="Logo" className="h-11" />
            ) : (
              <IconPencil size={30} className="text-yellow-600" />
            )}
            {isDrawerOpen && (
              <button
                onClick={onCloseDrawer}
                className="lg:hidden p-2 rounded-lg hover:bg-[#F5F5F7] dark:hover:bg-[#2f3235] transition-colors cursor-pointer"
              >
                <IconX size={20} className="text-[#1B2124] dark:text-[#ebf2f5]" />
              </button>
            )}
          </div>

          {/* Menu Items */}
          <ul className="space-y-2 p-4 flex-1">
            {menuItems.map((item, index) => (
              <li key={index} className="relative">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg ${
                      isDrawerOpen || !collapsed ? 'space-x-3' : 'justify-center'
                    } ${
                      isActive
                        ? 'bg-[#3385F0]/10 text-[#3385F0] font-medium'
                        : 'hover:bg-[#F5F5F7] text-[#1B2124] dark:hover:bg-[#2f3235] dark:text-[#ebf2f5]'
                    } transition-colors duration-200 w-full`
                  }
                  onClick={onCloseDrawer}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={16}
                        stroke={1.5}
                        className={
                          isActive
                            ? 'text-[#3385F0]'
                            : 'text-[#1B2124] dark:text-[#ebf2f5]'
                        }
                      />
                      {(isDrawerOpen || !collapsed) && (
                        <span className="text-[15px] tracking-normal">
                          {item.label}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default SideBar;
