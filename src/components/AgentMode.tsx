
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Bot, Zap } from 'lucide-react';

interface AgentModeProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const AgentMode: React.FC<AgentModeProps> = ({ isEnabled, onToggle }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-md border border-zinc-700">
      <div className="flex items-center gap-1.5">
        {isEnabled ? (
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-zinc-400" />
        )}
        <span className={`text-xs font-medium ${isEnabled ? 'text-yellow-400' : 'text-zinc-400'}`}>
          Agent Mode
        </span>
      </div>
      <Switch
        checked={isEnabled}
        onCheckedChange={onToggle}
        className="scale-75"
      />
    </div>
  );
};
