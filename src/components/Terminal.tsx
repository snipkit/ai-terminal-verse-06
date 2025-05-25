
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

type Message = {
  type: 'input' | 'response';
  content: string;
  model: string;
  timestamp: Date;
};

export const Terminal = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCommand = async (command: string) => {
    if (!command.trim()) return;

    // Add user input to messages
    setMessages(prev => [...prev, {
      type: 'input',
      content: command,
      model: selectedModel,
      timestamp: new Date()
    }]);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'response',
        content: `Response to: ${command}\nThis is a simulated AI response from ${selectedModel}`,
        model: selectedModel,
        timestamp: new Date()
      }]);
    }, 1000);
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
          
          <div className="flex items-center gap-2">
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
                Welcome to AI Terminal. Type a command to get started.
              </div>
            )}
            {messages.map((message, index) => (
              message.type === 'input' ? (
                <TerminalInput key={index} command={message.content} timestamp={message.timestamp} />
              ) : (
                <TerminalResponse key={index} response={message.content} model={message.model} timestamp={message.timestamp} />
              )
            ))}
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
