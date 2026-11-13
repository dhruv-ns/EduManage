import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserPlus, BookOpen, Building2,
  ClipboardCheck, Award, Settings, HelpCircle, GraduationCap,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { label: 'OVERVIEW', items: [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  ]},
  { label: 'MANAGEMENT', items: [
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Add Student', href: '/add-student', icon: UserPlus },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Departments', href: '/departments', icon: Building2 },
  ]},
  { label: 'ACADEMICS', items: [
    { name: 'Attendance', href: '/attendance', icon: ClipboardCheck },
    { name: 'Results', href: '/results', icon: Award },
  ]},
  { label: 'SYSTEM', items: [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help & Support', href: '/help-support', icon: HelpCircle },
  ]},
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-sidebar-bg border-r border-border z-50 flex flex-col transition-all duration-300 ${
          collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-base font-bold text-heading leading-tight">EduManage</h1>
              <p className="text-[10px] text-secondary leading-tight">Student Administration</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {navigation.map((group) => (
            <div key={group.label} className="mb-4">
              {!collapsed && (
                <p className="text-[10px] font-semibold text-secondary uppercase tracking-wider px-3 mb-1.5">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href ||
                  (item.href !== '/' && location.pathname.startsWith(item.href));
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => window.innerWidth < 1024 && setCollapsed(true)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                        : 'text-body hover:bg-primary-light hover:text-primary'
                    }`}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                    {!collapsed && <span>{item.name}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User profile at bottom */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-heading truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-secondary truncate">{user?.role === 'admin' ? 'Dean of Academic Affairs' : user?.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-border rounded-full items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5 text-secondary" /> : <ChevronLeft className="w-3.5 h-3.5 text-secondary" />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;

