
import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import AIMessage from './AIMessage';
import { DraLogoIcon, UserCircleIcon } from './icons/Icons';

interface ChatWindowProps {
  messages: ChatMessage[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <DraLogoIcon className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold">DRA Assistant</h2>
            <p className="mt-1">Ask me anything about the iHeart project.</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-4 max-w-4xl mx-auto ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 flex-shrink-0 bg-dra-brand rounded-full flex items-center justify-center">
                <DraLogoIcon className="w-5 h-5 text-black" />
              </div>
            )}
            <div className={`flex-1 ${msg.sender === 'user' ? 'flex justify-end' : ''}`}>
                {msg.sender === 'user' ? (
                  <div className="bg-dra-user-bubble p-4 rounded-lg max-w-2xl inline-block">
                    <p className="text-gray-800">{msg.text}</p>
                  </div>
                ) : (
                  <AIMessage message={msg} />
                )}
            </div>
             {msg.sender === 'user' && (
              <div className="w-8 h-8 flex-shrink-0 bg-gray-300 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatWindow;
