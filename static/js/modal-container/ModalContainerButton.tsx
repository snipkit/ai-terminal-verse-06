import React from 'react';
import './modal-container-button.css';

// How a button should appear.
export enum ModalContainerButtonTreatment {
  // The button will display inline with its surrounding content,
  // similar in appearance to an <a> tag.
  Inline,
  // The button will display as a full-width, typical button.
  FullWidth,
}

// The accent to apply to a full-width button.
// Not used for inline buttons.
export enum ModalContainerButtonAccent {
  Transparent,
  Primary,
  Secondary,
  Destructive,
  Toggleable,
}

// The value of the button "type" attribute.
export enum ModalContainerButtonType {
  Button,
  Submit,
}

interface BaseModalContainerButtonProps {
  accent?: ModalContainerButtonAccent;
  content: JSX.Element;
  disabled?: boolean;
  treatment: ModalContainerButtonTreatment;
  onClickFunction?: any;
}

interface IModalContainerLink extends BaseModalContainerButtonProps {
  href: string;
  buttonType: never;
  openInNewTab?: boolean;
}

interface IModalContainerButton extends BaseModalContainerButtonProps {
  href?: never;
  buttonType: ModalContainerButtonType.Button | ModalContainerButtonType.Submit;
  openInNewTab?: never;
  onClickFunction: any;
}

export type ModalContainerButtonProps =
  | IModalContainerLink
  | IModalContainerButton;

// A generic "button". Can be used both for inline buttons/links or for large buttons.
// If you are navigating to another webpage or have an intent link back to Warp,
// make sure to pass an href so it renders as an <a> rather than a <button>.
const ModalContainerButton = ({
  accent,
  buttonType,
  content,
  disabled,
  href,
  openInNewTab,
  onClickFunction,
  treatment,
}: ModalContainerButtonProps) => {
  const classes = [];

  if (treatment === ModalContainerButtonTreatment.Inline) {
    classes.push('modal-container-button-inline');
  } else {
    classes.push('modal-container-button-full-width');
  }

  if (accent === ModalContainerButtonAccent.Primary) {
    classes.push('modal-container-button--primary');
  } else if (accent === ModalContainerButtonAccent.Secondary) {
    classes.push('modal-container-button--secondary');
  } else if (accent === ModalContainerButtonAccent.Destructive) {
    classes.push('modal-container-button--destructive');
  } else if (accent === ModalContainerButtonAccent.Toggleable) {
    classes.push('modal-container-button--toggleable');
  }

  if (disabled) {
    classes.push('modal-container-button--disabled');
  }

  if (href) {
    return (
      <a
        className={classes.join(' ')}
        href={href}
        target={openInNewTab ? '_blank' : ''}
        rel="noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={classes.join(' ')}
      type={
        buttonType === ModalContainerButtonType.Button ? 'button' : 'submit'
      }
      disabled={disabled}
      onClick={onClickFunction}
    >
      {content}
    </button>
  );
};

ModalContainerButton.defaultProps = {
  accent: undefined,
  buttonType: ModalContainerButtonType.Submit,
  disabled: false,
  href: undefined,
  onClickFunction: undefined,
  openInNewTab: false,
};

export default ModalContainerButton;
