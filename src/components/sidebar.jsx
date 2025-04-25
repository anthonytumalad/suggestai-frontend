import { useState } from 'react';
import { 
    IconDashboard, 
    IconMessage, 
    IconPencil, 
    IconChevronDown
} from '@tabler/icons-react';
import Logo from '../assets/images/logo.png';

const SideBar = ({ collapsed }) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState('');
   
  const toggleFeedbackMenu = () => {
    if (!collapsed) {
        setIsFeedbackOpen(!isFeedbackOpen);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen ${
        collapsed ? 'w-[80px]' : 'w-[260px]'
      } bg-white border-r border-y border-[#C3D3DB] text-black z-10 transition-all duration-300 dark:bg-[#202325] dark:border-[#2f3235] dark:text-[#ebf2f5]`}
    >
      <nav className={`${collapsed ? 'items-center' : ''} flex flex-col`}>
        <div className={`${collapsed ? 'justify-center' : ''} flex px-8 mt-3 mb-5`}>
          {collapsed ? (
            <IconPencil size={30} className="text-gray-600" />
          ) : (
            <img src={Logo} alt="Logo" className="h-11" />
          )}
        </div>
        <ul className="space-y-4 p-8">
          <li>
            <a
              href="#"
              className={`flex items-center p-1 rounded-sm ${
                collapsed ? 'justify-center' : 'space-x-3'
              }  hover:bg-[#3385F0] hover:text-white transition-colors duration-200`}
            >
              <IconDashboard size={20} stroke="#1B2124"/>
              {!collapsed && <span>Dashboard</span>}
            </a>
          </li>
          <li>
            <div
              className={`flex items-center p-1 rounded-sm ${
                collapsed ? 'justify-center' : 'space-x-3'
              } hover:bg-[#3385F033] transition-colors duration-200 cursor-pointer`}
              onClick={toggleFeedbackMenu}
            >
              <IconMessage size={20} stroke="#1B2124" />
              {!collapsed && (
                <>
                  <span>Feedback</span>
                  <IconChevronDown
                    size={16}
                    stroke="#1B2124"
                    className={`ml-auto transition-transform duration-200 ${
                      isFeedbackOpen ? 'rotate-180' : ''
                    }`}
                  />
                </>
              )}
            </div>
            {!collapsed && isFeedbackOpen && (
              <ul className="mt-2 space-y-2 pl-8">
                <li>
                  <a
                    href="#"
                    className={`flex items-center p-1 rounded-sm text-[14px] text-[#1B2124] ${
                      activeSubItem === 'feedback-list'
                        ? 'bg-[#3385F0] text-white'
                        : 'hover:bg-[#3385F0] hover:text-white'
                    } transition-colors duration-200`}
                    onClick={() => setActiveSubItem('feedback-list')}
                  >
                    Feedback List
                  </a>
                </li>
                <li>
                  <a
                    href="#summarized-feedback"
                    className={`flex items-center p-1 rounded-sm text-[14px] text-[#1B2124] ${
                      activeSubItem === 'summarized-feedback'
                        ? 'bg-[#3385F0] text-white'
                        : 'hover:bg-[#3385F0] hover:text-white'
                    } transition-colors duration-200`}
                    onClick={() => setActiveSubItem('summarized-feedback')}
                  >
                    Summarized Feedback
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;