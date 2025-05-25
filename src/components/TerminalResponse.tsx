
import React from 'react';
import { Card } from '@/components/ui/card';
import { Bot } from 'lucide-react';

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
    <div className="flex items-start gap-3">
      <div className="flex items-center gap-2 mt-0.5">
        <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
          <Bot className="w-2.5 h-2.5 text-black" />
        </div>
      </div>
      <div className="flex-1">
        <Card className="p-4 bg-zinc-900 border-zinc-800 rounded-lg">
          <pre className="font-mono whitespace-pre-wrap text-sm text-zinc-100 leading-relaxed">{response}</pre>
          <div className="flex items-center justify-between text-xs text-zinc-500 mt-3 pt-2 border-t border-zinc-800">
            <span className="font-mono">{model}</span>
            <span className="font-mono">{timestamp.toLocaleTimeString()}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
