import React, { createContext, useContext, useState } from 'react';

export type FlashType = 'success' | 'error' | 'warning' | 'info';

export interface FlashMessage {
  id: string;
  type: FlashType;
  message: string;
}

interface FlashContextType {
  messages: FlashMessage[];
  addMessage: (type: FlashType, message: string) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

const FlashContext = createContext<FlashContextType | undefined>(undefined);

export const useFlash = () => {
  const context = useContext(FlashContext);
  if (!context) {
    throw new Error('useFlash must be used within a FlashProvider');
  }
  return context;
};

export const FlashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<FlashMessage[]>([]);

  const addMessage = (type: FlashType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setMessages((prev) => [...prev, { id, type, message }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeMessage(id);
    }, 5000);
  };

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <FlashContext.Provider value={{ messages, addMessage, removeMessage, clearMessages }}>
      {children}
    </FlashContext.Provider>
  );
};