import React from 'react';
import { X } from 'lucide-react';
import { useFlash, FlashType } from '@/contexts/FlashContext';
import { Button } from '@/components/ui/button';

const FlashMessages: React.FC = () => {
  const { messages, removeMessage } = useFlash();

  if (messages.length === 0) return null;

  const getTypeStyles = (type: FlashType) => {
    switch (type) {
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'error':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'info':
        return 'bg-info/10 text-info border-info/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-96">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-4 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300 transform ${getTypeStyles(
            message.type
          )}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{message.message}</p>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-6 w-6 p-0 hover:bg-background/20"
              onClick={() => removeMessage(message.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlashMessages;