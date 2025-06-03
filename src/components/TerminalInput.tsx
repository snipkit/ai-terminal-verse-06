import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { ChevronRight } from 'lucide-react';
import { getSyntaxHighlightedText } from './utils/syntaxHighlight';

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
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 mt-0.5">
          <ChevronRight className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-mono text-zinc-100 text-sm leading-relaxed">{getSyntaxHighlightedText(command)}</p>
          {timestamp && (
            <p className="text-xs text-zinc-500 mt-1 font-mono">
              {timestamp.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="font-mono bg-transparent border-none text-zinc-100 text-sm placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        placeholder="Enter your AI prompt..."
        autoFocus
      />
    </div>
  );
};
