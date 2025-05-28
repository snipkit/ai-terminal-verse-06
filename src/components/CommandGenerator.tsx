
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Copy, 
  Play, 
  Database, 
  Terminal, 
  Code,
  CheckCircle
} from 'lucide-react';

interface GeneratedCommand {
  command: string;
  explanation: string;
  category: 'sql' | 'git' | 'docker' | 'npm' | 'system' | 'debug';
  confidence: number;
}

interface CommandGeneratorProps {
  onExecuteCommand: (command: string) => void;
  isVisible: boolean;
}

export const CommandGenerator: React.FC<CommandGeneratorProps> = ({
  onExecuteCommand,
  isVisible
}) => {
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [generatedCommands, setGeneratedCommands] = useState<GeneratedCommand[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCommands, setCopiedCommands] = useState<Set<string>>(new Set());

  if (!isVisible) return null;

  const generateCommands = async () => {
    if (!naturalLanguageInput.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI command generation
    setTimeout(() => {
      const mockCommands: GeneratedCommand[] = [];
      
      const input = naturalLanguageInput.toLowerCase();
      
      if (input.includes('database') || input.includes('sql') || input.includes('query')) {
        mockCommands.push({
          command: `SELECT * FROM users WHERE created_at > '2024-01-01' ORDER BY created_at DESC LIMIT 10;`,
          explanation: 'Query to find recent users created after January 1st, 2024',
          category: 'sql',
          confidence: 95
        });
      }
      
      if (input.includes('git') || input.includes('commit') || input.includes('branch')) {
        mockCommands.push({
          command: `git log --oneline --since="7 days ago" --author="$(git config user.name)"`,
          explanation: 'Show commits from the last 7 days by current user',
          category: 'git',
          confidence: 92
        });
      }
      
      if (input.includes('docker') || input.includes('container')) {
        mockCommands.push({
          command: `docker ps -a --filter "status=exited" --format "table {{.Names}}\\t{{.Status}}"`,
          explanation: 'List all stopped containers with names and status',
          category: 'docker',
          confidence: 88
        });
      }
      
      if (input.includes('npm') || input.includes('package') || input.includes('dependencies')) {
        mockCommands.push({
          command: `npm audit --audit-level moderate`,
          explanation: 'Check for moderate and high severity vulnerabilities in dependencies',
          category: 'npm',
          confidence: 90
        });
      }
      
      if (input.includes('process') || input.includes('memory') || input.includes('cpu')) {
        mockCommands.push({
          command: `ps aux --sort=-%cpu | head -10`,
          explanation: 'Show top 10 processes by CPU usage',
          category: 'system',
          confidence: 94
        });
      }
      
      if (input.includes('debug') || input.includes('log') || input.includes('error')) {
        mockCommands.push({
          command: `tail -f /var/log/app.log | grep -i error --color=always`,
          explanation: 'Monitor application logs in real-time, highlighting errors',
          category: 'debug',
          confidence: 87
        });
      }
      
      // Fallback generic command
      if (mockCommands.length === 0) {
        mockCommands.push({
          command: `echo "Command generated for: ${naturalLanguageInput}"`,
          explanation: 'Generic command based on your natural language input',
          category: 'system',
          confidence: 70
        });
      }
      
      setGeneratedCommands(mockCommands);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommands(prev => new Set(prev).add(command));
      setTimeout(() => {
        setCopiedCommands(prev => {
          const newSet = new Set(prev);
          newSet.delete(command);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  const getCategoryIcon = (category: GeneratedCommand['category']) => {
    switch (category) {
      case 'sql':
        return <Database className="w-4 h-4" />;
      case 'git':
        return <Code className="w-4 h-4" />;
      case 'docker':
        return <Terminal className="w-4 h-4" />;
      case 'npm':
        return <Terminal className="w-4 h-4" />;
      case 'system':
        return <Terminal className="w-4 h-4" />;
      case 'debug':
        return <Terminal className="w-4 h-4" />;
      default:
        return <Terminal className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: GeneratedCommand['category']) => {
    switch (category) {
      case 'sql':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'git':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'docker':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'npm':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'system':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'debug':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="p-4 bg-zinc-900 border-zinc-800">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-medium text-zinc-200">Natural Language Command Generator</h3>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <Textarea
            value={naturalLanguageInput}
            onChange={(e) => setNaturalLanguageInput(e.target.value)}
            placeholder="Describe what you want to do in natural language... 
Examples:
• Show me recent database users
• Find git commits from last week
• List stopped Docker containers
• Check for npm vulnerabilities"
            className="bg-zinc-800 border-zinc-700 text-zinc-100 text-sm resize-none"
            rows={4}
          />
          
          <Button
            onClick={generateCommands}
            disabled={!naturalLanguageInput.trim() || isGenerating}
            className="w-full"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating Commands...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Commands
              </>
            )}
          </Button>
        </div>

        {/* Generated Commands */}
        {generatedCommands.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-zinc-300">Generated Commands</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {generatedCommands.map((cmd, index) => (
                <div
                  key={index}
                  className="p-3 bg-zinc-800 rounded-lg border border-zinc-700"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getCategoryColor(cmd.category)}`}>
                          {getCategoryIcon(cmd.category)}
                          <span className="ml-1">{cmd.category.toUpperCase()}</span>
                        </Badge>
                        <span className={`text-xs font-mono ${getConfidenceColor(cmd.confidence)}`}>
                          {cmd.confidence}% confidence
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-zinc-400">{cmd.explanation}</p>
                    
                    <div className="font-mono text-xs bg-black p-2 rounded border border-zinc-700">
                      <span className="text-green-400">$ </span>
                      <span className="text-zinc-200">{cmd.command}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(cmd.command)}
                        className="h-6 px-2 text-xs"
                      >
                        {copiedCommands.has(cmd.command) ? (
                          <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3 mr-1" />
                        )}
                        {copiedCommands.has(cmd.command) ? 'Copied' : 'Copy'}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onExecuteCommand(cmd.command)}
                        className="h-6 px-2 text-xs"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Execute
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
