
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Clock, 
  Star, 
  Tag,
  Filter,
  Copy,
  Play,
  Trash2
} from 'lucide-react';

interface HistoryItem {
  id: string;
  command: string;
  timestamp: Date;
  tags: string[];
  isFavorite: boolean;
  executionTime?: number;
  exitCode?: number;
  output?: string;
}

interface EnhancedHistoryProps {
  isVisible: boolean;
  onClose: () => void;
  onExecuteCommand: (command: string) => void;
}

export const EnhancedHistory: React.FC<EnhancedHistoryProps> = ({
  isVisible,
  onClose,
  onExecuteCommand
}) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const saved = localStorage.getItem('terminal-history');
    if (saved) {
      const parsed = JSON.parse(saved);
      setHistory(parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })));
    } else {
      // Create sample history
      const sampleHistory: HistoryItem[] = [
        {
          id: '1',
          command: 'git status',
          timestamp: new Date(Date.now() - 3600000),
          tags: ['git', 'status'],
          isFavorite: true,
          executionTime: 120,
          exitCode: 0
        },
        {
          id: '2',
          command: 'npm run dev',
          timestamp: new Date(Date.now() - 7200000),
          tags: ['npm', 'development'],
          isFavorite: false,
          executionTime: 2500,
          exitCode: 0
        },
        {
          id: '3',
          command: 'docker ps -a',
          timestamp: new Date(Date.now() - 10800000),
          tags: ['docker', 'containers'],
          isFavorite: true,
          executionTime: 340,
          exitCode: 0
        },
        {
          id: '4',
          command: 'kubectl get pods --all-namespaces',
          timestamp: new Date(Date.now() - 14400000),
          tags: ['kubernetes', 'kubectl', 'pods'],
          isFavorite: false,
          executionTime: 1200,
          exitCode: 0
        }
      ];
      setHistory(sampleHistory);
      saveHistory(sampleHistory);
    }
  };

  const saveHistory = (updatedHistory: HistoryItem[]) => {
    localStorage.setItem('terminal-history', JSON.stringify(updatedHistory));
  };

  const addToHistory = (command: string, tags: string[] = []) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      command,
      timestamp: new Date(),
      tags: tags.length > 0 ? tags : autoGenerateTags(command),
      isFavorite: false,
      executionTime: Math.floor(Math.random() * 3000) + 100,
      exitCode: Math.random() > 0.1 ? 0 : 1
    };

    const updated = [newItem, ...history].slice(0, 100); // Keep last 100 commands
    setHistory(updated);
    saveHistory(updated);
  };

  const autoGenerateTags = (command: string): string[] => {
    const tags: string[] = [];
    const lowerCommand = command.toLowerCase();

    // Tool-based tags
    if (lowerCommand.includes('git')) tags.push('git');
    if (lowerCommand.includes('npm') || lowerCommand.includes('yarn')) tags.push('package-manager');
    if (lowerCommand.includes('docker')) tags.push('docker');
    if (lowerCommand.includes('kubectl') || lowerCommand.includes('k8s')) tags.push('kubernetes');
    if (lowerCommand.includes('ssh') || lowerCommand.includes('scp')) tags.push('remote');

    // Action-based tags
    if (lowerCommand.includes('install') || lowerCommand.includes('add')) tags.push('install');
    if (lowerCommand.includes('remove') || lowerCommand.includes('delete') || lowerCommand.includes('rm')) tags.push('remove');
    if (lowerCommand.includes('build') || lowerCommand.includes('compile')) tags.push('build');
    if (lowerCommand.includes('test') || lowerCommand.includes('spec')) tags.push('test');
    if (lowerCommand.includes('deploy') || lowerCommand.includes('release')) tags.push('deploy');

    return tags.length > 0 ? tags : ['general'];
  };

  const toggleFavorite = (id: string) => {
    const updated = history.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    setHistory(updated);
    saveHistory(updated);
  };

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    saveHistory(updated);
  };

  const copyToClipboard = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = !filterTag || item.tags.includes(filterTag);
    const matchesFavorite = !showOnlyFavorites || item.isFavorite;
    
    return matchesSearch && matchesTag && matchesFavorite;
  });

  const allTags = Array.from(new Set(history.flatMap(item => item.tags))).sort();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full max-w-6xl mx-4 p-6 bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-zinc-200">Command History</h2>
            </div>
            <Button size="sm" variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search commands..."
                  className="pl-10 bg-zinc-800 border-zinc-600"
                />
              </div>
            </div>

            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-sm text-zinc-200"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            <Button
              size="sm"
              variant={showOnlyFavorites ? "default" : "ghost"}
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className="flex items-center gap-2"
            >
              <Star className={`w-4 h-4 ${showOnlyFavorites ? 'fill-current' : ''}`} />
              Favorites
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-2">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="p-3 border-zinc-700 hover:border-zinc-600 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-sm font-mono text-zinc-200 flex-1 truncate">
                      {item.command}
                    </code>
                    <div className="flex items-center gap-1">
                      {item.exitCode === 0 ? (
                        <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                          Failed
                        </Badge>
                      )}
                      {item.executionTime && (
                        <Badge variant="outline" className="text-xs">
                          {item.executionTime}ms
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <span>{item.timestamp.toLocaleString()}</span>
                    <div className="flex gap-1">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleFavorite(item.id)}
                  >
                    <Star className={`w-4 h-4 ${item.isFavorite ? 'text-yellow-400 fill-current' : 'text-zinc-400'}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(item.command)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      onExecuteCommand(item.command);
                      onClose();
                    }}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteHistoryItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {filteredHistory.length === 0 && (
            <div className="text-center py-8 text-zinc-500">
              No commands found matching your search criteria.
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-700 text-sm text-zinc-500">
          Showing {filteredHistory.length} of {history.length} commands
        </div>
      </Card>
    </div>
  );
};
