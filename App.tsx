
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Role, Project, Department, ChatMessage, DraResponse, CloudConnectionStatus } from './types';
import { ROLES, PROJECTS, ROLE_DEPARTMENT_MAP } from './constants';
import { getDraResponse } from './services/geminiService';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<Role>(Role.Employee);
  const [currentProject, setCurrentProject] = useState<Project>(Project.iHeart);
  const [currentDepartments, setCurrentDepartments] = useState<Set<Department>>(new Set([Department.Legal, Department.Approvals, Department.Title]));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cloudStatus, setCloudStatus] = useState<CloudConnectionStatus>(CloudConnectionStatus.DISCONNECTED);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || cloudStatus !== CloudConnectionStatus.CONNECTED) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add a temporary loading message for the AI
    const loadingMessageId = (Date.now() + 1).toString();
    const loadingMessage: ChatMessage = { id: loadingMessageId, sender: 'ai', isLoading: true };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await getDraResponse(text, currentRole, currentDepartments);
      let aiMessage: ChatMessage;

      if (typeof response === 'string') {
        aiMessage = { id: loadingMessageId, sender: 'ai', text: response };
      } else {
        aiMessage = { id: loadingMessageId, sender: 'ai', data: response as DraResponse };
      }
      
      setMessages(prev => prev.map(msg => msg.id === loadingMessageId ? aiMessage : msg));

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: loadingMessageId,
        sender: 'ai',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => prev.map(msg => msg.id === loadingMessageId ? errorMessage : msg));
    } finally {
      setIsLoading(false);
    }
  }, [currentRole, currentDepartments, cloudStatus]);

  const toggleDepartment = (dept: Department) => {
    setCurrentDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dept)) {
        newSet.delete(dept);
      } else {
        newSet.add(dept);
      }
      return newSet;
    });
  };
  
  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    const availableDeptsForNewRole = new Set(ROLE_DEPARTMENT_MAP[newRole]);
    setCurrentDepartments(prevSelectedDepts => {
      const newSelectedDepts = new Set<Department>();
      prevSelectedDepts.forEach(dept => {
        if (availableDeptsForNewRole.has(dept)) {
          newSelectedDepts.add(dept);
        }
      });
      return newSelectedDepts;
    });
  };

  const handleConnectToCloud = () => {
    setCloudStatus(CloudConnectionStatus.CONNECTING);
    setTimeout(() => {
      setCloudStatus(CloudConnectionStatus.CONNECTED);
    }, 1500); // Simulate connection delay
  };

  const visibleDepartments = ROLE_DEPARTMENT_MAP[currentRole];
  const isInputDisabled = isLoading || cloudStatus !== CloudConnectionStatus.CONNECTED;

  return (
    <div className="flex flex-col h-screen font-sans text-gray-800 bg-white">
      <Header
        currentRole={currentRole}
        setCurrentRole={handleRoleChange}
        roles={ROLES}
        currentProject={currentProject}
        setCurrentProject={setCurrentProject}
        projects={PROJECTS}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          departments={visibleDepartments}
          selectedDepartments={currentDepartments}
          onSelectDepartment={toggleDepartment}
          cloudStatus={cloudStatus}
          onConnect={handleConnectToCloud}
        />
        <main className="flex flex-col flex-1 bg-gray-50">
          <div className="p-3 border-b border-dra-border bg-white/80 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-500 mr-2">Searching in:</span>
                {currentDepartments.size > 0 ? (
                    [...currentDepartments].map(dept => (
                        <span key={dept} className="px-3 py-1 bg-dra-brand text-xs font-bold text-black rounded-full shadow-sm">
                          {dept}
                        </span>
                    ))
                ) : (
                    <span className="text-sm text-gray-400 italic">No departments selected. Please select one from the sidebar.</span>
                )}
            </div>
          </div>
          <ChatWindow messages={messages} />
          <MessageInput onSendMessage={handleSendMessage} disabled={isInputDisabled} />
        </main>
      </div>
    </div>
  );
};

export default App;