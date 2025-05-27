import React, { ReactNode } from 'react';

const ModalContainerButtonSpacer = ({ children }: { children: ReactNode }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {children}
    </div>
  );
};

export default ModalContainerButtonSpacer;
