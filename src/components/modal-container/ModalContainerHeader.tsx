
import React from 'react';

interface ModalContainerHeaderProps {
  children: React.ReactNode;
}

const ModalContainerHeader: React.FC<ModalContainerHeaderProps> = ({ children }) => {
  return (
    <h2 className="text-xl font-bold text-white text-center mb-6">
      {children}
    </h2>
  );
};

export default ModalContainerHeader;
