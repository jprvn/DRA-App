
import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { CodeBracketIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon } from './icons/Icons';

interface AIMessageProps {
  message: ChatMessage;
}

const AIMessage: React.FC<AIMessageProps> = ({ message }) => {
  const [view, setView] = useState<'narrative' | 'json'>('narrative');

  if (message.isLoading) {
    return (
        <div className="bg-white p-4 rounded-lg border border-dra-border max-w-2xl w-full animate-pulse">
            <div className="flex items-center space-x-2">
                <div className="h-2.5 bg-gray-300 rounded-full w-32"></div>
                <div className="h-2.5 bg-gray-200 rounded-full w-24"></div>
                <div className="h-2.5 bg-gray-200 rounded-full w-full"></div>
            </div>
        </div>
    );
  }

  if (message.text) {
    return (
      <div className="bg-white p-4 rounded-lg border border-dra-border max-w-2xl">
        <p className="text-gray-800">{message.text}</p>
      </div>
    );
  }

  if (!message.data) return null;

  const { data } = message;

  const StatusIcon = () => {
    switch (data.status) {
        case 'OK': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
        case 'NOT_FOUND': return <XCircleIcon className="w-5 h-5 text-red-500" />;
        case 'AMBIGUOUS': return <QuestionMarkCircleIcon className="w-5 h-5 text-yellow-500" />;
        default: return null;
    }
  }


  return (
    <div className="bg-white p-4 rounded-lg border border-dra-border max-w-2xl w-full space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-dra-border">
        <div className="flex items-center space-x-2">
          <StatusIcon/>
          <h3 className="font-semibold text-gray-700">{data.question}</h3>
        </div>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView('narrative')}
            className={`px-2 py-1 text-xs font-semibold rounded-md ${view === 'narrative' ? 'bg-white shadow' : 'text-gray-600'}`}
          >
            Narrative
          </button>
          <button
            onClick={() => setView('json')}
            className={`px-2 py-1 text-xs font-semibold rounded-md ${view === 'json' ? 'bg-white shadow' : 'text-gray-600'}`}
          >
            JSON
          </button>
        </div>
      </div>

      {view === 'narrative' ? (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2 text-gray-600">Answer</h4>
            <p className="text-gray-800 whitespace-pre-wrap">{data.answer_short}</p>
          </div>

          {data.citations && data.citations.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2 text-gray-600">Citations</h4>
              <ul className="space-y-2">
                {data.citations.map((citation, index) => (
                  <li key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <DocumentTextIcon className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600 font-mono italic">"{citation.quote}"</p>
                        <p className="text-xs text-gray-500 mt-1 font-semibold">
                          [{citation.pack}, Page {citation.page}]
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
           {data.notes && (
            <div>
              <h4 className="font-semibold text-sm mb-2 text-gray-600">Notes</h4>
              <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded-md border border-yellow-200">{data.notes}</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-600 flex items-center">
            <CodeBracketIcon className="w-4 h-4 mr-1"/> JSON Response
          </h4>
          <pre className="bg-gray-900 text-white p-3 rounded-md text-xs overflow-x-auto">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default AIMessage;
