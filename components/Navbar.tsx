
import React, { useState } from 'react';
import { Briefcase, Building, Users, BarChart, FileText, User, LogOut, ChevronDown, Cpu } from 'lucide-react';
import type { User as UserType } from '../types';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentUser: UserType | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, currentUser, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const companyNav = [
    { name: 'Dashboard', page: 'dashboard', icon: Briefcase },
    { name: 'Job Postings', page: 'jobPostings', icon: Building },
    { name: 'Candidates', page: 'candidates', icon: Users },
    { name: 'Analytics', page: 'analytics', icon: BarChart },
  ];

  const candidateNav = [
    { name: 'Resume Checker', page: 'dashboard', icon: FileText },
    { name: 'Job Postings', page: 'jobPostings', icon: Building },
    { name: 'My Profile', page: 'profile', icon: User },
  ];

  const navItems = currentUser?.role === 'company' ? companyNav : (currentUser?.role === 'candidate' ? candidateNav : []);

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Cpu className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900 ml-2">Chankya AI</span>
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  onClick={(e) => { e.preventDefault(); setCurrentPage(item.page); }}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                    ${currentPage === item.page ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                >
                  <item.icon className={`mr-2 h-5 w-5 ${currentPage === item.page ? 'text-indigo-600' : 'text-gray-400'}`} />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:ml-6">
            <div className="ml-4 relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                {currentUser && (
                  <>
                    <img className="h-9 w-9 rounded-full object-cover bg-gray-200 mr-2 border-2 border-indigo-100" src={`https://placehold.co/100x100/${currentUser.role === 'company' ? 'EBF4FF/4C51BF' : 'E6FFFA/2C7A7B'}?text=${currentUser.name.charAt(0)}`} alt="Profile" />
                    <span className="font-medium">{currentUser.name}</span>
                  </>
                )}
                <ChevronDown className="ml-1 h-5 w-5 text-gray-400" />
              </button>
              {isProfileOpen && currentUser && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsProfileOpen(false); onLogout(); }} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
