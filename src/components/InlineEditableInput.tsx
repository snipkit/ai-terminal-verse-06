
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronRight, Edit3, Check, X, Code, Sparkles } from 'lucide-react';

interface InlineEditableInputProps {
  onSubmit: (command: string) => void;
  capabilities?: {
    aiSuggestions: boolean;
    syntaxHighlighting: boolean;
    autoComplete: boolean;
    multiLine: boolean;
  };
}

export const InlineEditableInput: React.FC<InlineEditableInputProps> = ({ 
  onSubmit,
  capabilities = {
    aiSuggestions: true,
    syntaxHighlighting: true,
    autoComplete: true,
    multiLine: false
  }
}) => {
  const [input, setInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInput('');
      setHistoryIndex(null);
    } else if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      setInput(suggestions[0]);
      setShowSuggestions(false);
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0) {
        e.preventDefault();
        setHistoryIndex((prev) => {
          const newIndex = prev === null ? history.length - 1 : Math.max(0, prev - 1);
          setInput(history[newIndex] || '');
          return newIndex;
        });
      }
    } else if (e.key === 'ArrowDown') {
      if (history.length > 0) {
        e.preventDefault();
        setHistoryIndex((prev) => {
          if (prev === null) return null;
          const newIndex = Math.min(history.length - 1, prev + 1);
          setInput(history[newIndex] || '');
          return newIndex;
        });
      }
    }
  };

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input);
      setHistory((prev) => [...prev, input]);
      setInput('');
      setIsEditing(false);
      setShowSuggestions(false);
      setHistoryIndex(null);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    setHistoryIndex(null);
    // Simulate AI suggestions
    if (capabilities.aiSuggestions && value.length > 2) {
      const mockSuggestions = [
        `${value} --help`,
        `${value} --verbose`,
        `${value} | grep "pattern"`
      ];
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const getSyntaxHighlightedText = (text: string) => {
    if (!capabilities.syntaxHighlighting) return text;
    
    // Simple syntax highlighting simulation
    const parts = text.split(' ');
    return parts.map((part, index) => {
      if (part.startsWith('--')) {
        return <span key={index} className="text-yellow-400">{part} </span>;
      } else if (part.includes('|') || part.includes('>')) {
        return <span key={index} className="text-green-400">{part} </span>;
      } else if (index === 0) {
        return <span key={index} className="text-blue-400">{part} </span>;
      }
      return <span key={index} className="text-zinc-100">{part} </span>;
    });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
        
        <div className="flex-1 relative">
          {!isEditing ? (
            <div 
              className="font-mono text-zinc-100 text-sm cursor-text p-2 border border-transparent hover:border-zinc-700 rounded transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {input ? (
                <span className="flex items-center gap-2">
                  {getSyntaxHighlightedText(input)}
                  <Edit3 className="w-3 h-3 text-zinc-500" />
                </span>
              ) : (
                <span className="text-zinc-500">Enter your AI prompt...</span>
              )}
            </div>
          ) : (
            <div className="relative">
              <div className="relative">
  <Input
    ref={inputRef}
    value={input}
    onChange={(e) => handleInputChange(e.target.value)}
    onKeyDown={handleKeyDown}
    className="font-mono bg-zinc-900 border-zinc-700 text-zinc-100 text-sm placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-primary pr-20"
    placeholder="Enter your AI prompt..."
    autoComplete="off"
  />
  {/* Ghost text for AI suggestion */}
  {capabilities.aiSuggestions && suggestions.length > 0 && input && suggestions[0].startsWith(input) && (
    <span
      className="absolute left-0 top-0 h-full flex items-center pointer-events-none select-none text-zinc-500 font-mono text-sm pl-3"
      style={{ opacity: 0.5, zIndex: 1 }}
    >
      {suggestions[0].slice(input.length)}
    </span>
  )}
  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
    <Button
      size="sm"
      variant="ghost"
      className="h-6 w-6 p-0 hover:bg-green-600/20"
      onClick={handleSubmit}
    >
      <Check className="w-3 h-3 text-green-400" />
    </Button>
    <Button
      size="sm"
      variant="ghost"
      className="h-6 w-6 p-0 hover:bg-red-600/20"
      onClick={() => {
        setIsEditing(false);
        setInput('');
        setHistoryIndex(null);
      }}
    >
      <X className="w-3 h-3 text-red-400" />
    </Button>
  </div>
</div>
            </div>
          )}
          
          {/* AI Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-10">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-3 py-2 text-sm font-mono text-zinc-300 hover:bg-zinc-800 cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    setInput(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Capability indicators */}
      {isEditing && (
        <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
          {capabilities.aiSuggestions && (
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Suggestions
            </span>
          )}
          {capabilities.syntaxHighlighting && (
            <span className="flex items-center gap-1">
              <Code className="w-3 h-3" />
              Syntax Highlighting
            </span>
          )}
          {capabilities.autoComplete && (
            <span>Tab to complete</span>
          )}
        </div>
      )}
    </div>
  );
};
