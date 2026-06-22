import { useState } from 'react';
import useChatStore from '../store/chatStore';

const MessageInput = () => {
  const [content, setContent] = useState('');
  const { sendMessage, isLoading, currentSessionId } = useChatStore();
  const maxLength = 2000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !currentSessionId) return;

    const result = await sendMessage(content);
    if (result.success) {
      setContent('');
    }
  };

  return (
    <div className="flex-shrink-0 p-4 border-t border-slate-700 bg-slate-900">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message..."
          disabled={!currentSessionId || isLoading}
          maxLength={maxLength}
          className="flex-1 min-w-0 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span className="text-gray-500 text-xs whitespace-nowrap">
          {content.length}/{maxLength}
        </span>
        <button
          type="submit"
          disabled={!content.trim() || !currentSessionId || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
