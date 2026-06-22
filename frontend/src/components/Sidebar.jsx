import { useEffect } from 'react';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';

const Sidebar = () => {
  const { sessions, currentSessionId, fetchSessions, createSession, selectSession } = useChatStore();
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleNewChat = async () => {
    const title = `Chat ${new Date().toLocaleTimeString()}`;
    await createSession(title);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="w-64 bg-gray-800 h-screen flex flex-col border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={handleNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
          Sessions
        </h3>
        {sessions.length === 0 ? (
          <p className="text-gray-500 text-sm">No sessions yet</p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((session) => (
              <li key={session.id}>
                <button
                  onClick={() => selectSession(session.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition duration-200 ${
                    currentSessionId === session.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="truncate text-sm">{session.title}</div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
