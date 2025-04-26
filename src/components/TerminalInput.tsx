
import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';

interface TerminalInputProps {
  onSubmit?: (command: string) => void;
  command?: string;
  timestamp?: Date;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({ 
  onSubmit,
  command,
  timestamp
}) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(input);
      setInput('');
    }
  };

  if (command) {
    return (
      <div className="flex items-start gap-2">
        <span className="text-primary font-mono">$</span>
        <div className="flex-1">
          <p className="font-mono text-foreground">{command}</p>
          {timestamp && (
            <p className="text-xs text-muted-foreground mt-1">
              {timestamp.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-primary font-mono">$</span>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="font-mono bg-background border-border"
        placeholder="Enter a command..."
      />
    </div>
  );
};

