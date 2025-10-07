import React, { useState, useRef, useEffect } from 'react';
import { Role, Project } from '../types';
import { DraLogoIcon, ChevronDownIcon, UserCircleIcon, CheckIcon } from './icons/Icons';

interface HeaderProps {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  roles: Role[];
  currentProject: Project;
  setCurrentProject: (project: Project) => void;
  projects: Project[];
}

const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  roles,
  currentProject,
  setCurrentProject,
  projects,
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className="flex items-center justify-between p-3 border-b border-dra-border bg-white z-10 shadow-sm">
      <div className="flex items-center space-x-4">
        <DraLogoIcon className="w-8 h-8 text-dra-brand" />
        <h1 className="text-xl font-bold text-gray-800">DRA</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <select
            value={currentProject}
            onChange={(e) => setCurrentProject(e.target.value as Project)}
            className="appearance-none bg-gray-100 border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dra-brand"
          >
            {projects.map((project) => (
              <option key={project} value={project}>
                Project: {project}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="w-5 h-5 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsRoleDropdownOpen(prev => !prev)}
            className="flex items-center justify-between w-full appearance-none bg-dra-brand text-black rounded-md py-2 pl-3 pr-8 text-sm font-semibold hover:bg-dra-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dra-brand relative"
            aria-haspopup="true"
            aria-expanded={isRoleDropdownOpen}
          >
            <span>Role: {currentRole}</span>
            <UserCircleIcon className="w-5 h-5 text-black absolute right-2 top-1/2 -translate-y-1/2" />
          </button>
          
          {isRoleDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-dra-border animate-fade-in-down"
              role="menu"
            >
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setCurrentRole(role);
                    setIsRoleDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between transition-colors"
                  role="menuitem"
                >
                  <span>{role}</span>
                  {currentRole === role && <CheckIcon className="w-4 h-4 text-dra-brand" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;