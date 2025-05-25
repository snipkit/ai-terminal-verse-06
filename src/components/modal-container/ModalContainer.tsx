
import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';

export enum ModalContainerIconType {
  Logo = 'logo',
  Alert = 'alert',
  Warning = 'warning',
}

interface ModalContainerProps {
  iconType?: ModalContainerIconType;
  children: React.ReactNode;
}

const ModalContainer: React.FC<ModalContainerProps> = ({ iconType, children }) => {
  const getIcon = () => {
    switch (iconType) {
      case ModalContainerIconType.Alert:
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      case ModalContainerIconType.Warning:
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case ModalContainerIconType.Logo:
      default:
        return <div className="w-8 h-8 bg-blue-500 rounded" />;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="flex justify-center mb-6">
          {getIcon()}
        </div>
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
