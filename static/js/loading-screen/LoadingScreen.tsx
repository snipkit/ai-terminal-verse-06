import React from 'react';
import ModalContainer, {
  ModalContainerIconType,
} from '../modal-container/ModalContainer';
import ModalContainerBody from '../modal-container/ModalContainerBody';
import ModalContainerHeader from '../modal-container/ModalContainerHeader';
import './loading-screen.css';

export type LoadingScreenProps = {
  children?: React.ReactNode;
};

/**
 * A modal loading screen, with optional detail contents.
 */
export default function LoadingScreen({
  children = <></>,
}: LoadingScreenProps) {
  return (
    <div id="loading-screen-background">
      <ModalContainer iconType={ModalContainerIconType.Logo}>
        <ModalContainerHeader>Loading...</ModalContainerHeader>
        <ModalContainerBody>{children}</ModalContainerBody>
      </ModalContainer>
    </div>
  );
}

LoadingScreen.defaultProps = {
  children: undefined,
};
