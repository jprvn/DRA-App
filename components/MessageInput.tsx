
import React, { useState } from 'react';
import { SendIcon } from './icons/Icons';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSendMessage(text);
      setText('');
    }
  };

  const placeholderText = disabled 
    ? "Connect to the cloud to start chatting..."
    : "Ask about legal, title, or approvals packs for iHeart...";

  return (
    <div className="p-4 bg-white border-t border-dra-border">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center space-x-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholderText}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dra-brand focus:outline-none transition disabled:bg-gray-100"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled}
          className="p-3 bg-dra-brand text-black rounded-lg hover:bg-dra-accent disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          {disabled && !text ? (
             <SendIcon className="w-6 h-6" />
          ) : (
            text ? <SendIcon className="w-6 h-6" /> : <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;