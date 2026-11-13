import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Bell, ChevronDown, Menu, LogOut, User,
  Settings, Plus, UserPlus, BookOpen, ClipboardCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const breadcrumbMap = {
  '/': 'Overview',
  '/students': 'Students',
  '/add-student': 'Add New Student',
  '/courses': 'Courses',
  '/departments': 'Departments',
  '/attendance': 'Attendance',
  '/results': 'Results',
  '/settings': 'System Settings',
  '/help-support': 'Help & Support',
};

const TopNavbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentPage = breadcrumbMap[location.pathname] ||
    (location.pathname.startsWith('/students/') ? 'Student Profile' : 'Overview');

  const quickActions = [
    { name: 'Add Student', icon: UserPlus, href: '/add-student' },
    { name: 'Courses', icon: BookOpen, href: '/courses' },
    { name: 'Attendance', icon: ClipboardCheck, href: '/attendance' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  const handleQuickAction = (href) => {
    navigate(href);
    setShowQuickActions(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/students?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="h-[60px] bg-white border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left: Menu + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-secondary"
        >
          <Menu className="w-5 h-5" />
        </button>
        <nav className="text-sm text-secondary hidden sm:block">
          <span className="text-primary font-medium">EduManage</span>
          <span className="mx-2">›</span>
          <span>{currentPage}</span>
        </nav>
      </div>

      {/* Center: Search */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center max-w-md flex-1 mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records, students, course..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-app-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-body placeholder:text-secondary"
          />
        </div>
      </form>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Academic Year */}
        <div className="hidden lg:flex items-center px-3 py-1.5 bg-primary-50 rounded-lg text-xs font-medium text-primary">
          AY 2024-2025 • Fall Term
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowQuickActions(false); setShowProfileMenu(false); }}
            className="relative p-2 rounded-lg hover:bg-gray-100 text-secondary"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-border py-2 z-50">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-semibold text-heading">Notifications</p>
              </div>
              <div className="px-4 py-6 text-center text-sm text-secondary">
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="relative">
          <button
            onClick={() => { setShowQuickActions(!showQuickActions); setShowNotifications(false); setShowProfileMenu(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick Action</span>
          </button>
          {showQuickActions && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-border py-1 z-50">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    onClick={() => handleQuickAction(action.href)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-body hover:bg-primary-light hover:text-primary transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {action.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); setShowQuickActions(false); }}
            className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">{user?.name?.charAt(0) || 'A'}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-secondary hidden sm:block" />
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-border py-1 z-50">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-heading">{user?.name}</p>
                <p className="text-xs text-secondary">{user?.email}</p>
              </div>
              <button
                onClick={() => { navigate('/settings'); setShowProfileMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-body hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                Admin Profile
              </button>
              <button
                onClick={() => { navigate('/settings'); setShowProfileMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-body hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <hr className="my-1 border-border" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger-light transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showQuickActions || showProfileMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowQuickActions(false); setShowProfileMenu(false); setShowNotifications(false); }}
        />
      )}
    </header>
  );
};

export default TopNavbar;

