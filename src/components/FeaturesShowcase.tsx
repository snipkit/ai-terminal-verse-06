
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InlineEditableInput } from './InlineEditableInput';
import { CapabilityIndicators } from './CapabilityIndicators';
import { 
  Sparkles, 
  Code, 
  Eye, 
  Zap,
  Terminal,
  Lightbulb,
  Play
} from 'lucide-react';

interface Demo {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export const FeaturesShowcase: React.FC = () => {
  const [demoMessages, setDemoMessages] = useState<string[]>([]);

  const handleDemoCommand = (command: string) => {
    setDemoMessages(prev => [...prev, `Demo: ${command}`]);
  };

  const demos: Demo[] = [
    {
      id: 'inline-editing',
      title: 'Inline Editing',
      description: 'Click to edit commands in place with visual feedback and syntax highlighting',
      icon: <Eye className="w-5 h-5" />,
      component: (
        <div className="space-y-4">
          <InlineEditableInput 
            onSubmit={handleDemoCommand}
            capabilities={{
              aiSuggestions: true,
              syntaxHighlighting: true,
              autoComplete: true,
              multiLine: false
            }}
          />
          <div className="text-xs text-zinc-500">
            Click on the input area to start editing. Try typing "create" or "deploy" to see AI suggestions.
          </div>
        </div>
      )
    },
    {
      id: 'ai-suggestions',
      title: 'AI-Powered Suggestions',
      description: 'Smart command completion with context-aware suggestions',
      icon: <Sparkles className="w-5 h-5" />,
      component: (
        <div className="space-y-4">
          <InlineEditableInput 
            onSubmit={handleDemoCommand}
            capabilities={{
              aiSuggestions: true,
              syntaxHighlighting: false,
              autoComplete: true,
              multiLine: false
            }}
          />
          <div className="bg-zinc-800 p-3 rounded text-xs">
            <div className="text-zinc-400 mb-2">Try these commands to see AI suggestions:</div>
            <div className="space-y-1 font-mono">
              <div>• "git" - See git command suggestions</div>
              <div>• "npm" - See npm command suggestions</div>
              <div>• "docker" - See docker command suggestions</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'syntax-highlighting',
      title: 'Syntax Highlighting',
      description: 'Real-time command syntax coloring for better readability',
      icon: <Code className="w-5 h-5" />,
      component: (
        <div className="space-y-4">
          <InlineEditableInput 
            onSubmit={handleDemoCommand}
            capabilities={{
              aiSuggestions: false,
              syntaxHighlighting: true,
              autoComplete: false,
              multiLine: false
            }}
          />
          <div className="bg-zinc-800 p-3 rounded text-xs">
            <div className="text-zinc-400 mb-2">Example commands with syntax highlighting:</div>
            <div className="space-y-1 font-mono">
              <div><span className="text-blue-400">git</span> <span className="text-yellow-400">--help</span> <span className="text-green-400">|</span> <span className="text-zinc-100">grep</span></div>
              <div><span className="text-blue-400">npm</span> <span className="text-zinc-100">install</span> <span className="text-yellow-400">--save-dev</span></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'capabilities',
      title: 'System Capabilities',
      description: 'Visual indicators showing available system features and their status',
      icon: <Zap className="w-5 h-5" />,
      component: <CapabilityIndicators />
    }
  ];

  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
          <Terminal className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Enhanced Terminal Features</h2>
          <p className="text-sm text-zinc-400">
            Explore the advanced capabilities of the AI-powered terminal
          </p>
        </div>
      </div>

      <Tabs defaultValue="inline-editing" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-zinc-800">
          {demos.map((demo) => (
            <TabsTrigger 
              key={demo.id} 
              value={demo.id}
              className="flex items-center gap-2 text-xs data-[state=active]:bg-zinc-700"
            >
              {demo.icon}
              <span className="hidden sm:inline">{demo.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {demos.map((demo) => (
          <TabsContent key={demo.id} value={demo.id} className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="text-primary mt-0.5">
                {demo.icon}
              </div>
              <div>
                <h3 className="font-medium text-zinc-100 mb-1">{demo.title}</h3>
                <p className="text-sm text-zinc-400">{demo.description}</p>
              </div>
            </div>
            
            <div className="p-4 bg-black rounded-lg border border-zinc-800">
              {demo.component}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {demoMessages.length > 0 && (
        <div className="mt-4 p-3 bg-zinc-800 rounded border border-zinc-700">
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-zinc-200">Demo Output</span>
          </div>
          <div className="space-y-1">
            {demoMessages.map((message, index) => (
              <div key={index} className="text-xs font-mono text-zinc-400">
                {message}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
