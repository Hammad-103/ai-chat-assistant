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
    <div className="bg-gray-800 p-4 border-t border-gray-700">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message..."
            disabled={!currentSessionId || isLoading}
            maxLength={maxLength}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="text-gray-500 text-xs mt-1 text-right">
            {content.length}/{maxLength}
          </div>
        </div>
        <button
          type="submit"
          disabled={!content.trim() || !currentSessionId || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed self-start"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
