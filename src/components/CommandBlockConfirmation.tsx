
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Play,
  Info
} from 'lucide-react';
import { GeneratedCommandBlock } from '@/types/CommandPlugin';

interface CommandBlockConfirmationProps {
  commandBlock: GeneratedCommandBlock;
  onConfirm: (blockId: string) => void;
  onReject: (blockId: string) => void;
  onExecute: (blockId: string) => void;
  onCopy: (command: string) => void;
}

export const CommandBlockConfirmation: React.FC<CommandBlockConfirmationProps> = ({
  commandBlock,
  onConfirm,
  onReject,
  onExecute,
  onCopy
}) => {
  const getStatusColor = (status: GeneratedCommandBlock['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'executed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusIcon = (status: GeneratedCommandBlock['status']) => {
    switch (status) {
      case 'pending':
        return <AlertTriangle className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'executed':
        return <Play className="w-4 h-4" />;
    }
  };

  return (
    <Card className="p-4 bg-zinc-900 border-zinc-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-zinc-200">Generated Command Block</span>
        </div>
        <Badge variant="outline" className={`text-xs ${getStatusColor(commandBlock.status)}`}>
          {getStatusIcon(commandBlock.status)}
          <span className="ml-1">{commandBlock.status.toUpperCase()}</span>
        </Badge>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-zinc-400 mb-1">Original Input:</p>
          <p className="text-sm text-zinc-300 italic">"{commandBlock.originalInput}"</p>
        </div>

        <div>
          <p className="text-xs text-zinc-400 mb-1">Generated Command:</p>
          <div className="font-mono text-sm bg-black p-3 rounded border border-zinc-700">
            <span className="text-green-400">$ </span>
            <span className="text-zinc-200">{commandBlock.generatedCommand}</span>
          </div>
        </div>

        {commandBlock.explanation && (
          <div>
            <p className="text-xs text-zinc-400 mb-1">Explanation:</p>
            <p className="text-sm text-zinc-300">{commandBlock.explanation}</p>
          </div>
        )}

        {commandBlock.warnings && commandBlock.warnings.length > 0 && (
          <div>
            <p className="text-xs text-zinc-400 mb-1">Warnings:</p>
            <div className="space-y-1">
              {commandBlock.warnings.map((warning, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span className="text-xs text-yellow-300">{warning}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        {commandBlock.status === 'pending' && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onConfirm(commandBlock.id)}
              className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Confirm
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onReject(commandBlock.id)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </>
        )}

        {commandBlock.status === 'confirmed' && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onExecute(commandBlock.id)}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
          >
            <Play className="w-4 h-4 mr-1" />
            Execute
          </Button>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={() => onCopy(commandBlock.generatedCommand)}
          className="text-zinc-400 hover:text-zinc-300"
        >
          <Copy className="w-4 h-4 mr-1" />
          Copy
        </Button>
      </div>

      <div className="text-xs text-zinc-500 pt-1">
        Generated at {commandBlock.timestamp.toLocaleTimeString()}
      </div>
    </Card>
  );
};
