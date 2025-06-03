import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Play, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { getSyntaxHighlightedText } from './utils/syntaxHighlight';

interface AgentStep {
  id: string;
  description: string;
  command?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
}

interface AgentResponseProps {
  response: string;
  model: string;
  timestamp: Date;
  steps?: AgentStep[];
  onExecuteStep?: (stepId: string) => void;
}

export const AgentResponse: React.FC<AgentResponseProps> = ({
  response,
  model,
  timestamp,
  steps = [],
  onExecuteStep
}) => {
  const getStatusIcon = (status: AgentStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3.5 h-3.5 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
      case 'running':
        return <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />;
      default:
        return <Play className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center gap-2 mt-0.5">
        <div className="w-4 h-4 bg-yellow-400 rounded-sm flex items-center justify-center">
          <Bot className="w-2.5 h-2.5 text-black" />
        </div>
      </div>
      <div className="flex-1">
        <Card className="p-4 bg-zinc-900 border-zinc-800 rounded-lg">
          <pre className="font-mono whitespace-pre-wrap text-sm text-zinc-100 leading-relaxed mb-4">{response}</pre>
          
          {steps.length > 0 && (
            <div className="space-y-2 border-t border-zinc-700 pt-3">
              <div className="text-xs text-zinc-400 font-medium mb-2">Execution Plan:</div>
              {steps.map((step) => (
                <div key={step.id} className="flex items-center justify-between bg-zinc-800 rounded p-2">
                  <div className="flex items-center gap-2 flex-1">
                    {getStatusIcon(step.status)}
                    <div className="flex-1">
                      <div className="text-xs text-zinc-200">{step.description}</div>
                      {step.command && (
                        <div className="text-xs text-zinc-400 font-mono mt-0.5">$
                          {getSyntaxHighlightedText(step.command)}
                        </div>
                      )}
                      {step.output && (
                        <div className="text-xs text-green-400 font-mono mt-1 bg-zinc-900 p-1 rounded">
                          {step.output}
                        </div>
                      )}
                    </div>
                  </div>
                  {step.status === 'pending' && onExecuteStep && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs bg-zinc-700 border-zinc-600 hover:bg-zinc-600"
                      onClick={() => onExecuteStep(step.id)}
                    >
                      Execute
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-zinc-500 mt-3 pt-2 border-t border-zinc-800">
            <span className="font-mono flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {model} (Agent Mode)
            </span>
            <span className="font-mono">{timestamp.toLocaleTimeString()}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
