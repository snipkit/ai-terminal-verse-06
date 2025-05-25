
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface WarpErrorProps {
  error: string;
}

const WarpError: React.FC<WarpErrorProps> = ({ error }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-6 bg-zinc-900 border-zinc-800 text-center">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-4">Error</h2>
        
        <p className="text-zinc-300 mb-4">{error}</p>
        
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </Card>
    </div>
  );
};

export default WarpError;
