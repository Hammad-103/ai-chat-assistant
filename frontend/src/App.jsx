import { useEffect, useState } from 'react';
import useAuthStore from './store/authStore';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';

function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return showLogin ? (
      <Login onSwitchToRegister={() => setShowLogin(false)} />
    ) : (
      <Register onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-900">
      <Sidebar />
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <ChatWindow />
        <MessageInput />
      </div>
    </div>
  );
}

export default App;
