import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  path: string;
  icon: string;
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { title: '仪表盘', path: '/', icon: 'fa-tachometer-alt' },
    { title: '网站管理', path: '/websites', icon: 'fa-globe' },
    { title: '安全报告', path: '/reports', icon: 'fa-file-report' },
    { title: '爬取链接', path: '/crawled-links', icon: 'fa-link' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out z-20",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <div className={cn("flex items-center space-x-2", !sidebarOpen && "justify-center w-full")}>
            <i className="fa-solid fa-shield text-blue-600 dark:text-blue-400 text-xl"></i>
            {sidebarOpen && <span className="font-bold text-lg">网站安全监测系统</span>}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn("p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700", !sidebarOpen && "hidden")}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        </div>
        
        <nav className="py-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="mb-1">
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-md transition-colors duration-200",
                    location.pathname === item.path
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  )}
                >
                  <i className={`fa-solid ${item.icon} ${sidebarOpen ? "mr-3" : "mx-auto"}`}></i>
                  {sidebarOpen && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        

      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 h-16 border-b dark:border-gray-700 flex items-center justify-between px-6 shadow-sm">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 lg:hidden"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索..."
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
              />
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative">
                <i className="fa-solid fa-bell"></i>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
