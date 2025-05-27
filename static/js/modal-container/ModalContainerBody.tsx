import React from 'react';
import './modal-container-body.css';

const ModalContainerBody = ({ children }: { children: React.ReactNode }) => {
  return <div className="modal-container-body">{children}</div>;
};

export default ModalContainerBody;
