
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FullPageModalProps {
  error?: string;
  appDetected?: boolean;
  appLaunchUrl?: string;
  message?: string;
  viewOnWebCallback?: () => void;
}

const FullPageModal: React.FC<FullPageModalProps> = ({
  error,
  appDetected,
  appLaunchUrl,
  message,
  viewOnWebCallback
}) => {
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-6 bg-zinc-900 border-zinc-800 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Notice</h2>
          <p className="text-zinc-300 mb-6">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-6 bg-zinc-900 border-zinc-800 text-center">
        <h2 className="text-xl font-bold text-white mb-4">Open in Warp</h2>
        {message && <p className="text-zinc-300 mb-6">{message}</p>}
        
        <div className="space-y-3">
          {appDetected && appLaunchUrl && (
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => window.open(appLaunchUrl, '_blank')}
            >
              Open in Desktop App
            </Button>
          )}
          
          {viewOnWebCallback && (
            <Button 
              variant="outline" 
              className="w-full border-zinc-600 hover:bg-zinc-800"
              onClick={viewOnWebCallback}
            >
              Continue in Web
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FullPageModal;
