import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './navbar';
import SideBar from './sidebar';

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="relative min-h-screen">
      <TopNav
        isCollapsed={isCollapsed}
        isDrawerOpen={isDrawerOpen}
        onToggle={toggleSidebar}
        onDrawerToggle={toggleDrawer}
      />
      <SideBar
        collapsed={isCollapsed}
        isDrawerOpen={isDrawerOpen}
        onCloseDrawer={closeDrawer}
      />
      <main
        className={`transition-all duration-300 pt-16 ${
          isCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[260px]'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

// import { Outlet } from "react-router-dom";
// import Navbar from "./nav";
// const Layout = () => {
//   return (
//     <div>
//       <Navbar />
//       <main>
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default Layout;