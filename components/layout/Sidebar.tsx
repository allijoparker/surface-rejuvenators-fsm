import React from 'react';
import { UserRole, Job } from '../../types';
import { HomeIcon, ListTodo, Package, Wrench, Briefcase } from 'lucide-react';

interface SidebarProps {
  userRole: UserRole;
  activeView: string;
  setActiveView: (view: string) => void;
  setSelectedJob: (job: Job | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, activeView, setActiveView, setSelectedJob }) => {
  
  const handleNav = (view: string) => {
    setSelectedJob(null);
    setActiveView(view);
  }
  
  const navItems = {
    ADMIN: [
      { name: 'Dashboard', view: 'DASHBOARD', icon: HomeIcon },
      { name: 'Jobs', view: 'JOBS', icon: Briefcase },
      { name: 'Inventory', view: 'INVENTORY', icon: Package },
    ],
    TECHNICIAN: [
      { name: 'My Jobs', view: 'TECHNICIAN_DASHBOARD', icon: ListTodo },
    ],
  };

  const NavLink: React.FC<{ name: string, view: string, icon: React.ElementType }> = ({ name, view, icon: Icon }) => {
    const isActive = activeView === view;
    return (
      <li
        onClick={() => handleNav(view)}
        className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
          isActive ? 'bg-brand-primary text-white shadow-md' : 'text-gray-600 hover:bg-brand-secondary hover:text-brand-primary-dark'
        }`}
      >
        <Icon className="w-6 h-6 mr-3" />
        <span className="font-medium">{name}</span>
      </li>
    );
  };

  return (
    <aside className="w-64 bg-white shadow-lg flex-shrink-0 hidden md:block print:hidden">
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-700 font-display">Navigation</h2>
      </div>
      <nav className="mt-2 px-2">
        <ul>
          {userRole === 'ADMIN' && navItems.ADMIN.map(item => <NavLink key={item.view} {...item} />)}
          {userRole === 'TECHNICIAN' && navItems.TECHNICIAN.map(item => <NavLink key={item.view} {...item} />)}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;