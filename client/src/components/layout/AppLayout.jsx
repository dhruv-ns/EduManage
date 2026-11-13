import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // On mobile, collapsed means hidden
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="min-h-screen bg-app-bg">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <TopNavbar onMenuToggle={toggleSidebar} />

        <main className="p-4 lg:p-6 min-h-[calc(100vh-60px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

