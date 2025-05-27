import React from 'react';
import alertIcon from '../assets/triangle-alert.svg';
import checkIcon from '../assets/check.svg';
import logoIcon from '../assets/warp_logo.svg';
import warningIcon from '../assets/triangle-warning.svg';
import './modal-container.css';

export enum ModalContainerIconType {
  Alert,
  Check,
  Logo,
  Warning,
}

export interface ModalContainerProps {
  children: React.ReactNode;
  iconType: ModalContainerIconType;
}

export const renderIcon = (iconType: ModalContainerIconType) => {
  let iconSrc;
  let iconTitle;
  let iconAltText;
  const classes = ['modal-container-icon-container-image'];

  switch (iconType) {
    case ModalContainerIconType.Alert:
      iconSrc = alertIcon;
      iconTitle = 'Alert';
      iconAltText = 'Alert icon';
      break;
    case ModalContainerIconType.Check:
      iconSrc = checkIcon;
      iconTitle = 'Check';
      iconAltText = 'Check icon';
      break;
    case ModalContainerIconType.Logo:
      iconSrc = logoIcon;
      iconTitle = 'Warp';
      iconAltText = 'Warp logo';
      classes.push('modal-container-icon-container-image--logo');
      break;
    case ModalContainerIconType.Warning:
      iconSrc = warningIcon;
      iconTitle = 'Warning';
      iconAltText = 'Warning icon';
      break;
    default:
      break;
  }

  return (
    <div className="modal-container-icon-container">
      <img
        className={classes.join(' ')}
        src={iconSrc}
        title={iconTitle}
        alt={iconAltText}
      />
    </div>
  );
};

const ModalContainer = ({ children, iconType }: ModalContainerProps) => {
  return (
    <div className="background">
      <div className="background-inner">
        <div className="modal-container">
          <div className="modal-container-background" />
          <div className="modal-container-contents font-main">
            {renderIcon(iconType)}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalContainer;
