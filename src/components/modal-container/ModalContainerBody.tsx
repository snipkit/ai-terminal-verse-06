
import React from 'react';

interface ModalContainerBodyProps {
  children: React.ReactNode;
}

const ModalContainerBody: React.FC<ModalContainerBodyProps> = ({ children }) => {
  return (
    <div className="text-zinc-300 space-y-4">
      {children}
    </div>
  );
};

export default ModalContainerBody;
