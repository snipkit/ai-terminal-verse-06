
import React from 'react';
import { Button } from '@/components/ui/button';

export enum ModalContainerButtonType {
  Button = 'button',
  Submit = 'submit',
}

export enum ModalContainerButtonTreatment {
  Primary = 'primary',
  FullWidth = 'fullWidth',
}

export enum ModalContainerButtonAccent {
  Primary = 'primary',
  Destructive = 'destructive',
  Transparent = 'transparent',
}

interface ModalContainerButtonProps {
  content: React.ReactNode;
  buttonType: ModalContainerButtonType;
  treatment: ModalContainerButtonTreatment;
  accent: ModalContainerButtonAccent;
  disabled?: boolean;
  onClickFunction?: () => void;
}

const ModalContainerButton: React.FC<ModalContainerButtonProps> = ({
  content,
  buttonType,
  treatment,
  accent,
  disabled,
  onClickFunction,
}) => {
  const getVariant = () => {
    switch (accent) {
      case ModalContainerButtonAccent.Destructive:
        return 'destructive';
      case ModalContainerButtonAccent.Transparent:
        return 'outline';
      case ModalContainerButtonAccent.Primary:
      default:
        return 'default';
    }
  };

  const getClassName = () => {
    const baseClasses = 'mb-3';
    return treatment === ModalContainerButtonTreatment.FullWidth
      ? `${baseClasses} w-full`
      : baseClasses;
  };

  return (
    <Button
      type={buttonType}
      variant={getVariant()}
      className={getClassName()}
      disabled={disabled}
      onClick={onClickFunction}
    >
      {content}
    </Button>
  );
};

export default ModalContainerButton;
