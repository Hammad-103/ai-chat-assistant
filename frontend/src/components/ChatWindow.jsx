import useChatStore from '../store/chatStore';

const ChatWindow = () => {
  const { messages, currentSessionId, isLoading } = useChatStore();

  if (!currentSessionId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <p className="text-gray-400 text-lg">Select or create a session to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-900 p-4">
      {messages.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-lg">Start a conversation by sending a message</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => {
            if (!message) return null;
            return (
              <div
                key={message.id ?? index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] px-4 py-2 rounded-lg bg-gray-700 text-gray-400">
                <p className="text-sm">Assistant is typing…</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
