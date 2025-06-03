import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TerminalBlock } from './TerminalBlock';
import { SelfCorrectionTracker } from './SelfCorrectionTracker';
import type { Message, CorrectionAttempt } from '@/hooks/useTerminalLogic';

interface TerminalMessagesProps {
  messages: Message[];
  corrections: CorrectionAttempt[];
  agentMode: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
  onExecuteStep: (stepId: string) => void;
  onCopy: (output: string) => void;
  onRerun: (command: string) => void;
  onDelete: (id: string) => void;
  onShare?: (output: string) => void;
}

export const TerminalMessages: React.FC<TerminalMessagesProps> = ({
  messages,
  corrections,
  agentMode,
  scrollRef,
  onExecuteStep,
  onCopy,
  onRerun,
  onDelete,
  onShare
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
        {messages.map((message, index) => (
  <div className="animate-fade-in" key={index}>
    <TerminalBlock
      id={String(index)}
      command={message.type === 'input' ? message.content : ''}
      output={message.type !== 'input' ? message.content : ''}
      status={message.type === 'agent-response' ? 'running' : message.type === 'response' ? 'success' : 'running'}
      timestamp={typeof message.timestamp === 'string' ? message.timestamp : message.timestamp.toLocaleTimeString()}
      onCopy={onCopy}
      onRerun={onRerun}
      onDelete={onDelete}
      onShare={onShare}
    />
  </div>
))}
      </div>
    </ScrollArea>
  );
};
