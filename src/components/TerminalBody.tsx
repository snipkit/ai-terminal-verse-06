
import React from 'react';

interface TerminalBodyProps {
  children: React.ReactNode;
}

export const TerminalBody: React.FC<TerminalBodyProps> = ({ children }) => {
  return (
    <div className="bg-black border border-zinc-800 border-t-0 rounded-b-xl">
      {children}
    </div>
  );
};
