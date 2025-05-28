
import React from 'react';

interface TerminalContainerProps {
  children: React.ReactNode;
}

export const TerminalContainer: React.FC<TerminalContainerProps> = ({ children }) => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-4">
      {children}
    </div>
  );
};
