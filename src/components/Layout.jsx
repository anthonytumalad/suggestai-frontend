import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './navbar';
import SideBar from './sidebar';

const Layout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubSidebarVisible, setIsSubSidebarVisible] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleSubSidebarChange = (visible) => {
    setIsSubSidebarVisible(visible);
  };

  return (
    <div className="relative min-h-screen">
      <TopNav isDrawerOpen={isDrawerOpen} onDrawerToggle={toggleDrawer} />
      <SideBar
        isDrawerOpen={isDrawerOpen}
        onCloseDrawer={closeDrawer}
        onSubSidebarChange={handleSubSidebarChange}
      />
      <main
        className={`transition-all duration-300 pt-[60px] ${
          isSubSidebarVisible ? 'lg:ml-[300px]' : 'lg:ml-[100px]'
        } min-h-screen`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;