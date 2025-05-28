
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TerminalInput } from './TerminalInput';
import { TerminalResponse } from './TerminalResponse';
import { AgentResponse } from './AgentResponse';
import { SelfCorrectionTracker } from './SelfCorrectionTracker';
import type { Message, CorrectionAttempt } from '@/hooks/useTerminalLogic';

interface TerminalMessagesProps {
  messages: Message[];
  corrections: CorrectionAttempt[];
  agentMode: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
  onExecuteStep: (stepId: string) => void;
}

export const TerminalMessages: React.FC<TerminalMessagesProps> = ({
  messages,
  corrections,
  agentMode,
  scrollRef,
  onExecuteStep
}) => {
  return (
    <ScrollArea className="h-[600px] p-6" ref={scrollRef}>
      <div className="space-y-4">
        <SelfCorrectionTracker 
          corrections={corrections} 
          isActive={agentMode && corrections.some(c => c.status === 'attempting')} 
        />
        
        {messages.length === 0 && (
          <div className="text-zinc-500 text-sm font-mono">
            Welcome to AI Terminal. {agentMode ? 'Enhanced Agent Mode is enabled with natural language detection and self-correction.' : 'Type a command to get started.'}
          </div>
        )}
        {messages.map((message, index) => {
          if (message.type === 'input') {
            return <TerminalInput key={index} command={message.content} timestamp={message.timestamp} />;
          } else if (message.type === 'agent-response') {
            return (
              <AgentResponse 
                key={index} 
                response={message.content} 
                model={message.model} 
                timestamp={message.timestamp}
                steps={message.steps}
                onExecuteStep={onExecuteStep}
              />
            );
          } else {
            return <TerminalResponse key={index} response={message.content} model={message.model} timestamp={message.timestamp} />;
          }
        })}
      </div>
    </ScrollArea>
  );
};
