
import React from 'react';
import { InlineEditableInput } from './InlineEditableInput';

interface TerminalInputAreaProps {
  onSubmit: (command: string) => void;
}

export const TerminalInputArea: React.FC<TerminalInputAreaProps> = ({ onSubmit }) => {
  return (
    <div className="border-t border-zinc-800 p-4">
      <InlineEditableInput 
        onSubmit={onSubmit}
        capabilities={{
          aiSuggestions: true,
          syntaxHighlighting: true,
          autoComplete: true,
          multiLine: false
        }}
      />
    </div>
  );
};
