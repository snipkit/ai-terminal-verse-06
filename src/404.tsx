import React from 'react';
import ModalContainer, {
  ModalContainerIconType,
} from './modal-container/ModalContainer';
import ModalContainerHeader from './modal-container/ModalContainerHeader';
import ModalContainerBody from './modal-container/ModalContainerBody';

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
