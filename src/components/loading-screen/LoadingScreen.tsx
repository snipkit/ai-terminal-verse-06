
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Loading Warp</h2>
          <p className="text-zinc-400">Preparing your terminal experience...</p>
        </div>
        
        <div className="space-y-3">
          <Skeleton className="h-4 w-full bg-zinc-800" />
          <Skeleton className="h-4 w-3/4 bg-zinc-800" />
          <Skeleton className="h-4 w-1/2 bg-zinc-800" />
        </div>
        
        <div className="flex justify-center mt-6">
          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
