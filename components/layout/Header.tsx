import React from 'react';
import { UserRole } from '../../types';
import Logo from '../common/Logo';

interface HeaderProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, setUserRole }) => {
  const toggleRole = () => {
    setUserRole(userRole === 'ADMIN' ? 'TECHNICIAN' : 'ADMIN');
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center z-10 print:hidden">
      <div className="flex items-center gap-4">
        <Logo className="h-10 w-auto" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 font-display">
          Surface Rejuvenators <span className="text-brand-primary">FSM</span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-600 hidden sm:inline">{userRole} View</span>
        <div className="flex items-center cursor-pointer" onClick={toggleRole}>
          <div className={`w-14 h-8 flex items-center rounded-full p-1 duration-300 ease-in-out ${userRole === 'ADMIN' ? 'bg-brand-primary' : 'bg-gray-400'}`}>
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${userRole === 'ADMIN' ? 'translate-x-6' : ''}`}></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;