
import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Zap, Settings, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TerminalInput } from './TerminalInput';
import { TerminalResponse } from './TerminalResponse';
import { AgentMode } from './AgentMode';
import { AgentResponse } from './AgentResponse';

type AgentStep = {
  id: string;
  description: string;
  command?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
};

type Message = {
  type: 'input' | 'response' | 'agent-response';
  content: string;
  model: string;
  timestamp: Date;
  steps?: AgentStep[];
};

export const Terminal = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [agentMode, setAgentMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateAgentResponse = (command: string): AgentStep[] => {
    // Simulate agent breaking down tasks into steps
    if (command.toLowerCase().includes('create') && command.toLowerCase().includes('component')) {
      return [
        { id: '1', description: 'Analyze component requirements', status: 'pending' },
        { id: '2', description: 'Generate component structure', command: 'mkdir components', status: 'pending' },
        { id: '3', description: 'Create TypeScript interfaces', status: 'pending' },
        { id: '4', description: 'Implement component logic', status: 'pending' },
        { id: '5', description: 'Add styling and exports', status: 'pending' }
      ];
    }
    
    if (command.toLowerCase().includes('deploy') || command.toLowerCase().includes('build')) {
      return [
        { id: '1', description: 'Run tests and linting', command: 'npm run test', status: 'pending' },
        { id: '2', description: 'Build production bundle', command: 'npm run build', status: 'pending' },
        { id: '3', description: 'Optimize assets', status: 'pending' },
        { id: '4', description: 'Deploy to production', command: 'npm run deploy', status: 'pending' }
      ];
    }

    return [];
  };

  const handleCommand = async (command: string) => {
    if (!command.trim()) return;

    // Add user input to messages
    setMessages(prev => [...prev, {
      type: 'input',
      content: command,
      model: selectedModel,
      timestamp: new Date()
    }]);

    // Simulate AI response
    setTimeout(() => {
      if (agentMode) {
        const steps = simulateAgentResponse(command);
        const agentResponse = steps.length > 0 
          ? `I'll help you with: ${command}\n\nI've broken this down into ${steps.length} executable steps. Each step can be executed with your permission.`
          : `Processing: ${command}\n\nThis is an Agent Mode response with enhanced reasoning and task breakdown capabilities.`;

        setMessages(prev => [...prev, {
          type: 'agent-response',
          content: agentResponse,
          model: selectedModel,
          timestamp: new Date(),
          steps
        }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'response',
          content: `Response to: ${command}\nThis is a standard AI response from ${selectedModel}`,
          model: selectedModel,
          timestamp: new Date()
        }]);
      }
    }, 1000);
  };

  const handleExecuteStep = (stepId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.type === 'agent-response' && msg.steps) {
        const updatedSteps = msg.steps.map(step => 
          step.id === stepId 
            ? { ...step, status: 'running' as const }
            : step
        );
        
        // Simulate step completion
        setTimeout(() => {
          setMessages(prevMsgs => prevMsgs.map(prevMsg => {
            if (prevMsg.type === 'agent-response' && prevMsg.steps) {
              return {
                ...prevMsg,
                steps: prevMsg.steps.map(step => 
                  step.id === stepId 
                    ? { ...step, status: 'completed' as const, output: `✓ Step completed successfully` }
                    : step
                )
              };
            }
            return prevMsg;
          }));
        }, 2000);

        return { ...msg, steps: updatedSteps };
      }
      return msg;
    }));
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-4">
      {/* Warp-style header */}
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
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <AgentMode isEnabled={agentMode} onToggle={setAgentMode} />
            <Select value={selectedModel} onValueChange={setSelectedModel}>
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
            <Button variant="ghost" size="sm" onClick={clearMessages} className="h-8 px-2 text-xs">
              Clear
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Terminal content */}
      <div className="bg-black border border-zinc-800 border-t-0 rounded-b-xl">
        <ScrollArea className="h-[600px] p-6" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-zinc-500 text-sm font-mono">
                Welcome to AI Terminal. {agentMode ? 'Agent Mode is enabled - AI can execute multi-step tasks.' : 'Type a command to get started.'}
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
                    onExecuteStep={handleExecuteStep}
                  />
                );
              } else {
                return <TerminalResponse key={index} response={message.content} model={message.model} timestamp={message.timestamp} />;
              }
            })}
          </div>
        </ScrollArea>
        
        {/* Input area */}
        <div className="border-t border-zinc-800 p-4">
          <TerminalInput onSubmit={handleCommand} />
        </div>
      </div>
    </div>
  );
};
