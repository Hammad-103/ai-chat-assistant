import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useChatStore = create((set) => ({
  sessions: [],
  currentSessionId: null,
  messages: [],
  isLoading: false,
  error: null,

  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/chat/sessions');
      set({ sessions: response.data.sessions, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch sessions', 
        isLoading: false 
      });
    }
  },

  createSession: async (title) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/chat/sessions', { title });
      const newSession = response.data.session;
      set((state) => ({ 
        sessions: [newSession, ...state.sessions],
        currentSessionId: newSession.id,
        messages: [],
        isLoading: false 
      }));
      return { success: true, session: newSession };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create session', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message || 'Failed to create session' };
    }
  },

  selectSession: async (sessionId) => {
    set({ currentSessionId: sessionId, messages: [] });
    await useChatStore.getState().fetchMessages(sessionId);
  },

  fetchMessages: async (sessionId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/chat/sessions/${sessionId}/messages`);
      set({ messages: response.data.messages, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch messages', 
        isLoading: false 
      });
    }
  },

  sendMessage: async (content) => {
    const { currentSessionId, messages } = useChatStore.getState();
    if (!currentSessionId) {
      return { success: false, error: 'No session selected' };
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/chat/sessions/${currentSessionId}/messages`, { content });
      const { userMessage, assistantMessage } = response.data;
      
      if (assistantMessage) {
        set((state) => ({ 
          messages: [...state.messages, userMessage, assistantMessage],
          isLoading: false 
        }));
      } else {
        set((state) => ({ 
          messages: [...state.messages, userMessage],
          error: 'AI response failed, but your message was saved',
          isLoading: false 
        }));
      }
      return { success: true };
    } catch (error) {
      let errorMessage = error.response?.data?.message || 'Failed to send message';
      if (error.response?.status === 429) {
        errorMessage = "You're sending messages too quickly. Please wait a moment.";
      }
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      return { success: false, error: errorMessage };
    }
  },
}));

export default useChatStore;
