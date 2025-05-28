
import React from 'react';
import { Card } from '@/components/ui/card';
import { RotateCcw, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface CorrectionAttempt {
  id: string;
  originalError: string;
  correctionStrategy: string;
  status: 'attempting' | 'success' | 'failed';
  timestamp: Date;
}

interface SelfCorrectionTrackerProps {
  corrections: CorrectionAttempt[];
  isActive: boolean;
}

export const SelfCorrectionTracker: React.FC<SelfCorrectionTrackerProps> = ({
  corrections,
  isActive
}) => {
  if (!isActive && corrections.length === 0) return null;

  const getStatusIcon = (status: CorrectionAttempt['status']) => {
    switch (status) {
      case 'attempting':
        return <Clock className="w-3 h-3 text-yellow-400 animate-pulse" />;
      case 'success':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-3 h-3 text-red-400" />;
    }
  };

  return (
    <Card className="p-3 bg-zinc-900 border-zinc-800 border-l-4 border-l-orange-400">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-medium text-orange-400">Self-Correction Active</span>
        </div>
        
        {corrections.length > 0 && (
          <div className="space-y-1">
            {corrections.map((correction) => (
              <div key={correction.id} className="flex items-start gap-2 text-xs">
                {getStatusIcon(correction.status)}
                <div className="flex-1">
                  <div className="text-zinc-300">{correction.correctionStrategy}</div>
                  <div className="text-zinc-500">{correction.originalError}</div>
                </div>
                <div className="text-zinc-500">{correction.timestamp.toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
