import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, User, Activity, Calendar, MessageSquare, FileText, ClipboardList, Shield, Settings, Heart } from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-md font-medium transition-colors duration-200 text-sm ${
        isActive 
          ? 'bg-white/20 text-white' 
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`
    }
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </NavLink>
);

const DashboardLayout = ({ children, roleView }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = {
    Patient: [
      { to: '/patient/dashboard', icon: User, label: 'Profile' },
      { to: '/patient/search', icon: Activity, label: 'Find Doctors' },
      { to: '/patient/appointments', icon: Calendar, label: 'Appointments' },
      { to: '/patient/prescriptions', icon: ClipboardList, label: 'Prescriptions' },
      { to: '/patient/records', icon: FileText, label: 'Medical Records' },
      { to: '/patient/chat', icon: MessageSquare, label: 'Messages' },
    ],
    Doctor: [
      { to: '/doctor/dashboard', icon: Activity, label: 'Overview' },
      { to: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
      { to: '/doctor/prescriptions', icon: ClipboardList, label: 'Prescriptions' },
      { to: '/doctor/chat', icon: MessageSquare, label: 'Messages' },
      { to: '/doctor/profile', icon: Settings, label: 'Settings' },
    ],
    Admin: [
      { to: '/admin/dashboard', icon: Activity, label: 'Overview' },
      { to: '/admin/users', icon: User, label: 'Users' },
      { to: '/admin/verifications', icon: Shield, label: 'Doctor Verification' },
    ]
  };

  const links = menuItems[roleView] || [];

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-60 bg-[#3A86FF] flex flex-col hidden md:flex">
        <div className="h-14 flex items-center px-5 border-b border-white/20">
          <span className="text-lg font-bold text-white">Medorte</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {links.map((link) => (
            <SidebarLink key={link.to} {...link} />
          ))}
        </div>
        
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-md bg-white/20 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-white truncate w-28">{user?.name}</p>
              <p className="text-xs text-white/60">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-left text-white/80 hover:bg-white/10 rounded-md font-medium transition-colors duration-200 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F7F9FB]">
        <header className="md:hidden h-14 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#3A86FF] flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#3A86FF]">Medorte</span>
          </div>
          <button onClick={handleLogout} className="text-[#6B7280] p-2 hover:bg-gray-100 rounded-md transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
