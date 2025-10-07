
import React from 'react';
import { Department, CloudConnectionStatus } from '../types';
import { CloudIcon } from './icons/Icons';

interface SidebarProps {
  departments: Department[];
  selectedDepartments: Set<Department>;
  onSelectDepartment: (department: Department) => void;
  cloudStatus: CloudConnectionStatus;
  onConnect: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ departments, selectedDepartments, onSelectDepartment, cloudStatus, onConnect }) => {
  
  const getStatusIndicatorClass = () => {
    switch(cloudStatus) {
      case CloudConnectionStatus.CONNECTED: return "bg-green-500";
      case CloudConnectionStatus.CONNECTING: return "bg-yellow-500 animate-pulse";
      case CloudConnectionStatus.DISCONNECTED: return "bg-red-500";
    }
  }

  return (
    <aside className="w-64 bg-white p-4 border-r border-dra-border overflow-y-auto flex flex-col">
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Worker Shortcuts
        </h2>
        <div className="space-y-2">
          {departments.map((dept) => {
            const isSelected = selectedDepartments.has(dept);
            return (
              <button
                key={dept}
                onClick={() => onSelectDepartment(dept)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  isSelected
                    ? 'bg-dra-accent text-black shadow-inner'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-dra-border">
         <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
            <CloudIcon className="w-4 h-4 mr-2" />
            Cloud Connection
        </h2>
        <div className="bg-gray-100 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Status</span>
                <div className="flex items-center space-x-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusIndicatorClass()}`}></div>
                    <span className="text-sm font-semibold text-gray-800">{cloudStatus}</span>
                </div>
            </div>
            <button
                onClick={onConnect}
                disabled={cloudStatus !== CloudConnectionStatus.DISCONNECTED}
                className="w-full text-center px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-150 bg-dra-brand text-black hover:bg-dra-accent disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {cloudStatus === CloudConnectionStatus.CONNECTING && (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
              )}
              {cloudStatus === CloudConnectionStatus.DISCONNECTED ? 'Connect' : cloudStatus}
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;