
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Zap, Clock } from 'lucide-react';

interface CommandSuggestion {
  id: string;
  command: string;
  description: string;
  confidence: number;
  category: 'autocomplete' | 'error-recovery' | 'workflow' | 'contextual';
  reasoning?: string;
}

interface SmartSuggestionsProps {
  currentInput: string;
  recentCommands: string[];
  lastError?: string;
  onSelectSuggestion: (command: string) => void;
  isVisible: boolean;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  currentInput,
  recentCommands,
  lastError,
  onSelectSuggestion,
  isVisible
}) => {
  const [suggestions, setSuggestions] = useState<CommandSuggestion[]>([]);

  useEffect(() => {
    generateSuggestions();
  }, [currentInput, recentCommands, lastError]);

  const generateSuggestions = () => {
    const newSuggestions: CommandSuggestion[] = [];

    // Auto-completion suggestions
    if (currentInput.length > 2) {
      const autocompleteSuggestions = generateAutocompleteSuggestions(currentInput);
      newSuggestions.push(...autocompleteSuggestions);
    }

    // Error recovery suggestions
    if (lastError) {
      const errorSuggestions = generateErrorRecoverySuggestions(lastError);
      newSuggestions.push(...errorSuggestions);
    }

    // Contextual workflow suggestions
    const workflowSuggestions = generateWorkflowSuggestions(recentCommands);
    newSuggestions.push(...workflowSuggestions);

    setSuggestions(newSuggestions.slice(0, 5)); // Limit to 5 suggestions
  };

  const generateAutocompleteSuggestions = (input: string): CommandSuggestion[] => {
    const commonCommands = [
      { cmd: 'git status', desc: 'Check repository status' },
      { cmd: 'git add .', desc: 'Stage all changes' },
      { cmd: 'git commit -m ""', desc: 'Commit with message' },
      { cmd: 'npm install', desc: 'Install dependencies' },
      { cmd: 'npm run dev', desc: 'Start development server' },
      { cmd: 'docker ps', desc: 'List running containers' },
      { cmd: 'kubectl get pods', desc: 'List Kubernetes pods' }
    ];

    return commonCommands
      .filter(({ cmd }) => cmd.toLowerCase().includes(input.toLowerCase()))
      .map((item, index) => ({
        id: `auto-${index}`,
        command: item.cmd,
        description: item.desc,
        confidence: 0.8,
        category: 'autocomplete'
      }));
  };

  const generateErrorRecoverySuggestions = (error: string): CommandSuggestion[] => {
    const errorPatterns = [
      {
        pattern: /permission denied/i,
        suggestion: 'sudo',
        description: 'Try with elevated permissions'
      },
      {
        pattern: /command not found/i,
        suggestion: 'which',
        description: 'Check if command exists in PATH'
      },
      {
        pattern: /no such file/i,
        suggestion: 'ls -la',
        description: 'List directory contents'
      }
    ];

    return errorPatterns
      .filter(({ pattern }) => pattern.test(error))
      .map((item, index) => ({
        id: `error-${index}`,
        command: item.suggestion,
        description: item.description,
        confidence: 0.9,
        category: 'error-recovery',
        reasoning: `Based on error: "${error.substring(0, 50)}..."`
      }));
  };

  const generateWorkflowSuggestions = (commands: string[]): CommandSuggestion[] => {
    const workflows = [
      {
        trigger: ['git add', 'git status'],
        next: 'git commit -m "Update"',
        desc: 'Continue Git workflow'
      },
      {
        trigger: ['npm install'],
        next: 'npm run dev',
        desc: 'Start development after install'
      },
      {
        trigger: ['docker build'],
        next: 'docker run',
        desc: 'Run the built container'
      }
    ];

    return workflows
      .filter(({ trigger }) => 
        trigger.some(cmd => commands.some(recent => recent.includes(cmd)))
      )
      .map((item, index) => ({
        id: `workflow-${index}`,
        command: item.next,
        description: item.desc,
        confidence: 0.7,
        category: 'workflow'
      }));
  };

  const getCategoryIcon = (category: CommandSuggestion['category']) => {
    switch (category) {
      case 'autocomplete': return <Zap className="w-4 h-4" />;
      case 'error-recovery': return <Lightbulb className="w-4 h-4" />;
      case 'workflow': return <Clock className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: CommandSuggestion['category']) => {
    switch (category) {
      case 'autocomplete': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'error-recovery': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'workflow': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  if (!isVisible || suggestions.length === 0) return null;

  return (
    <Card className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-zinc-900 border-zinc-700 z-50">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Smart Suggestions
        </h4>
        <div className="space-y-1">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="flex items-center justify-between group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(suggestion.category)}
                  <span className="font-mono text-sm text-zinc-200 truncate">
                    {suggestion.command}
                  </span>
                  <Badge variant="outline" className={`text-xs ${getCategoryColor(suggestion.category)}`}>
                    {Math.round(suggestion.confidence * 100)}%
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 ml-6">{suggestion.description}</p>
                {suggestion.reasoning && (
                  <p className="text-xs text-zinc-500 ml-6 italic">{suggestion.reasoning}</p>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onSelectSuggestion(suggestion.command)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Use
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
