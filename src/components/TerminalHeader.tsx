
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Zap, Settings } from 'lucide-react';
import { EnhancedAgentMode } from './EnhancedAgentMode';

interface TerminalHeaderProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  agentMode: boolean;
  onAgentModeToggle: (enabled: boolean) => void;
  agentRunning: boolean;
  onAgentPause: () => void;
  onAgentResume: () => void;
  onAgentStop: () => void;
  onClearMessages: () => void;
  dataTransmissionVisible: boolean;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  selectedModel,
  onModelChange,
  agentMode,
  onAgentModeToggle,
  agentRunning,
  onAgentPause,
  onAgentResume,
  onAgentStop,
  onClearMessages,
  dataTransmissionVisible
}) => {
  return (
    <div className="bg-zinc-900 rounded-t-xl border border-zinc-800 border-b-0">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-zinc-200">AI Terminal</span>
            {dataTransmissionVisible && (
              <div className="flex items-center gap-1 text-xs text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Transmitting...
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <EnhancedAgentMode 
            isEnabled={agentMode} 
            onToggle={onAgentModeToggle}
            isRunning={agentRunning}
            onPause={onAgentPause}
            onResume={onAgentResume}
            onStop={onAgentStop}
          />
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-[140px] h-8 text-xs bg-zinc-800 border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
              <SelectItem value="claude-3">Claude 3</SelectItem>
              <SelectItem value="llama-3">Llama 3</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" onClick={onClearMessages} className="h-8 px-2 text-xs">
            Clear
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
