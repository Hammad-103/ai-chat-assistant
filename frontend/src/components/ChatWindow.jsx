import useChatStore from '../store/chatStore';

const ChatWindow = () => {
  const { messages, currentSessionId, isLoading } = useChatStore();

  if (!currentSessionId) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-gray-900">
        <p className="text-gray-400 text-lg">Select or create a session to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-gray-900 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-lg">Start a conversation by sending a message</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              if (!message) return null;
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id ?? index}
                  className={`max-w-[75%] rounded-lg p-3 break-words ${
                    isUser
                      ? 'ml-auto bg-blue-600 text-white'
                      : 'mr-auto bg-slate-800 text-slate-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              );
            })}
            {isLoading && (
              <div className="mr-auto max-w-[75%] rounded-lg p-3 bg-slate-800 text-slate-400">
                <p className="text-sm">Assistant is typing…</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
