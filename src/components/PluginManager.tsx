import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Puzzle, 
  Settings, 
  Plus,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { CommandPlugin } from '@/types/CommandPlugin';
import { builtInPlugins } from '@/plugins/builtInPlugins';

interface PluginManagerProps {
  enabledPlugins: string[];
  onTogglePlugin: (pluginId: string, enabled: boolean) => void;
  isVisible: boolean;
}

export const PluginManager: React.FC<PluginManagerProps> = ({
  enabledPlugins,
  onTogglePlugin,
  isVisible
}) => {
  const [expandedPlugins, setExpandedPlugins] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  if (!isVisible) return null;

  const filteredPlugins = builtInPlugins.filter((plugin) => {
    const q = search.toLowerCase();
    return (
      plugin.name.toLowerCase().includes(q) ||
      plugin.description.toLowerCase().includes(q) ||
      plugin.category.toLowerCase().includes(q)
    );
  });

  const toggleExpanded = (pluginId: string) => {
    const newExpanded = new Set(expandedPlugins);
    if (newExpanded.has(pluginId)) {
      newExpanded.delete(pluginId);
    } else {
      newExpanded.add(pluginId);
    }
    setExpandedPlugins(newExpanded);
  };

  const getCategoryColor = (category: CommandPlugin['category']) => {
    switch (category) {
      case 'devops':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'database':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'git':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'container':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'package':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'cloud':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  return (
    <Card className="p-4 bg-zinc-900 border-zinc-800" role="region" aria-label="Plugin Manager">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-medium text-zinc-200">Command Plugins</h3>
          </div>
          <Button size="sm" variant="ghost" className="h-8 px-2">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search plugins..."
          className="w-full mb-2 p-2 rounded bg-zinc-800 text-zinc-100 border border-zinc-700 text-xs font-mono focus:outline-none"
        />

        <div className="space-y-2">
          {filteredPlugins.map((plugin) => {
            const isEnabled = enabledPlugins.includes(plugin.id);
            const isExpanded = expandedPlugins.has(plugin.id);

            return (
              <div key={plugin.id} className="border border-zinc-700 rounded-lg">
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleExpanded(plugin.id)}
                        className="h-6 w-6 p-0"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                      <span className="text-sm font-medium text-zinc-200 flex items-center gap-1">
                        <span
                          className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-400' : 'bg-zinc-500'}`}
                          aria-label={isEnabled ? 'Enabled' : 'Disabled'}
                          aria-checked={isEnabled}
                          role="status"
                        ></span>
                        {plugin.name}
                      </span>
                      <Badge variant="outline" className={`text-xs ${getCategoryColor(plugin.category)}`}>
                        {plugin.category}
                      </Badge>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) => onTogglePlugin(plugin.id, checked)}
                      className="scale-75"
                      aria-checked={isEnabled}
                      aria-label={isEnabled ? `Disable ${plugin.name}` : `Enable ${plugin.name}`}
                    />
                  </div>

                  <p className="text-xs text-zinc-400">{plugin.description}</p>

                  {isExpanded && (
                    <div className="space-y-2 pt-2 border-t border-zinc-700">
                      <div>
                        <p className="text-xs font-medium text-zinc-300 mb-1">Trigger Words:</p>
                        <div className="flex flex-wrap gap-1">
                          {plugin.triggerWords.map((word, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {word}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-zinc-300 mb-1">Output Format:</p>
                        <Badge variant="outline" className="text-xs">
                          {plugin.schema.outputFormat}
                        </Badge>
                      </div>

                      {plugin.schema.parameters && plugin.schema.parameters.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-zinc-300 mb-1">Parameters:</p>
                          <div className="space-y-1">
                            {plugin.schema.parameters.map((param, index) => (
                              <div key={index} className="text-xs text-zinc-400">
                                <span className="font-mono">{param.name}</span>
                                <span className="text-zinc-500"> ({param.type})</span>
                                {param.required && <span className="text-red-400"> *</span>}
                                - {param.description}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-zinc-500 text-center pt-2">
          {enabledPlugins.length} of {builtInPlugins.length} plugins enabled
        </div>
      </div>
    </Card>
  );
};
