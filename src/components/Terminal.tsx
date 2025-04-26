
import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
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

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 bg-card border-border">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold">AI Terminal</h1>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4 Optimized</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4 Mini</SelectItem>
              <SelectItem value="llama-3">Llama 3</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">Clear</Button>
        </div>
      </div>
      
      <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            message.type === 'input' ? (
              <TerminalInput key={index} command={message.content} timestamp={message.timestamp} />
            ) : (
              <TerminalResponse key={index} response={message.content} model={message.model} timestamp={message.timestamp} />
            )
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <TerminalInput onSubmit={handleCommand} />
      </div>
    </Card>
  );
};

