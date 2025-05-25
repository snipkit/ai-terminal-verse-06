
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface WoWStatus {
  supported: boolean;
  reason?: string;
}

interface UnsupportedModalProps {
  status: WoWStatus;
  redirectMessage: string;
  appLaunchUrl: string;
}

const UnsupportedModal: React.FC<UnsupportedModalProps> = ({
  status,
  redirectMessage,
  appLaunchUrl
}) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-6 bg-zinc-900 border-zinc-800 text-center">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-yellow-500" />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-4">Browser Not Supported</h2>
        
        <p className="text-zinc-300 mb-4">
          {status.reason || 'Your browser doesn\'t support the required features for Warp on Web.'}
        </p>
        
        <p className="text-zinc-400 text-sm mb-6">{redirectMessage}</p>
        
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => window.open(appLaunchUrl, '_blank')}
        >
          Download Warp Desktop
        </Button>
      </Card>
    </div>
  );
};

export default UnsupportedModal;
