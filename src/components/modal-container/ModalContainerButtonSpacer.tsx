
import React from 'react';

interface ModalContainerButtonSpacerProps {
  children: React.ReactNode;
}

const ModalContainerButtonSpacer: React.FC<ModalContainerButtonSpacerProps> = ({ children }) => {
  return (
    <div className="space-y-4">
      {children}
    </div>
  );
};

export default ModalContainerButtonSpacer;
