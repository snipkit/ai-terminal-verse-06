import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Zap, Settings, Info, Book, Workflow, Sparkles, Puzzle, Sun, Moon } from 'lucide-react';
import { EnhancedAgentMode } from './EnhancedAgentMode';
import { CapabilityIndicators } from './CapabilityIndicators';

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
  onToggleRunbooks: () => void;
  onToggleWorkflows: () => void;
  onToggleCommandGenerator: () => void;
  onTogglePluginManager: () => void;
  runbooksVisible: boolean;
  workflowsVisible: boolean;
  commandGeneratorVisible: boolean;
  pluginManagerVisible: boolean;
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
  dataTransmissionVisible,
  onToggleRunbooks,
  onToggleWorkflows,
  onToggleCommandGenerator,
  onTogglePluginManager,
  runbooksVisible,
  workflowsVisible,
  commandGeneratorVisible,
  pluginManagerVisible
}) => {
  const [showCapabilities, setShowCapabilities] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  // Toggle theme on root element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Keyboard shortcut: Cmd/Ctrl+T for theme toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

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
          
          <div className="hidden lg:block">
            <CapabilityIndicators compact />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button 
              variant={pluginManagerVisible ? "default" : "ghost"} 
              size="sm" 
              onClick={onTogglePluginManager}
              className="h-8 px-2 text-xs"
              title="Plugin Manager"
            >
              <Puzzle className="w-4 h-4" />
            </Button>
            <Button 
              variant={commandGeneratorVisible ? "default" : "ghost"} 
              size="sm" 
              onClick={onToggleCommandGenerator}
              className="h-8 px-2 text-xs"
              title="Command Generator"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
            <Button 
              variant={runbooksVisible ? "default" : "ghost"} 
              size="sm" 
              onClick={onToggleRunbooks}
              className="h-8 px-2 text-xs"
              title="Runbook Library"
            >
              <Book className="w-4 h-4" />
            </Button>
            <Button 
              variant={workflowsVisible ? "default" : "ghost"} 
              size="sm" 
              onClick={onToggleWorkflows}
              className="h-8 px-2 text-xs"
              title="Workflow Engine"
            >
              <Workflow className="w-4 h-4" />
            </Button>
          </div>
          
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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowCapabilities(!showCapabilities)}
            className="h-8 px-2 text-xs lg:hidden"
          >
            <Info className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClearMessages} className="h-8 px-2 text-xs">
            Clear
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-zinc-500" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Mobile capability indicators */}
      {showCapabilities && (
        <div className="px-4 pb-3 lg:hidden">
          <CapabilityIndicators />
        </div>
      )}
    </div>
  );
};
