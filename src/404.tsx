
import React from 'react';
import ModalContainer, {
  ModalContainerIconType,
} from './components/modal-container/ModalContainer';
import ModalContainerHeader from './components/modal-container/ModalContainerHeader';
import ModalContainerBody from './components/modal-container/ModalContainerBody';

const Warp404 = () => {
  return (
    <ModalContainer iconType={ModalContainerIconType.Warning}>
      <ModalContainerHeader>
        <div className="font-weight-600">404</div>
      </ModalContainerHeader>
      <ModalContainerBody>Page not found</ModalContainerBody>
    </ModalContainer>
  );
};

export default Warp404;
