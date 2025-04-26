
import React from 'react';
import { Card } from '@/components/ui/card';

interface TerminalResponseProps {
  response: string;
  model: string;
  timestamp: Date;
}

export const TerminalResponse: React.FC<TerminalResponseProps> = ({
  response,
  model,
  timestamp
}) => {
  return (
    <Card className="p-4 bg-secondary border-border">
      <div className="flex flex-col gap-2">
        <pre className="font-mono whitespace-pre-wrap text-sm">{response}</pre>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span>{model}</span>
          <span>{timestamp.toLocaleTimeString()}</span>
        </div>
      </div>
    </Card>
  );
};

