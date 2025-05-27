import React from 'react';
import './modal-container-header.css';

const ModalContainerHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="modal-container-header">{children}</div>;
};

export default ModalContainerHeader;
