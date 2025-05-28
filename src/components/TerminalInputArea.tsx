
import React from 'react';
import { TerminalInput } from './TerminalInput';

interface TerminalInputAreaProps {
  onSubmit: (command: string) => void;
}

export const TerminalInputArea: React.FC<TerminalInputAreaProps> = ({ onSubmit }) => {
  return (
    <div className="border-t border-zinc-800 p-4">
      <TerminalInput onSubmit={onSubmit} />
    </div>
  );
};
