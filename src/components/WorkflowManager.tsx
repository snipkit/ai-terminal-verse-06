
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter,
  Share,
  Download,
  Plus,
  Tag,
  Terminal,
  User,
  ExternalLink
} from 'lucide-react';

export interface WorkflowArgument {
  name: string;
  description?: string;
  default_value?: string;
  required?: boolean;
}

export interface Workflow {
  name: string;
  command: string;
  description?: string;
  tags?: string[];
  arguments?: WorkflowArgument[];
  source_url?: string;
  author?: string;
  author_url?: string;
  shells?: string[];
  slug: string;
}

interface WorkflowManagerProps {
  workflows: Workflow[];
  onCreateWorkflow?: () => void;
  onExecuteWorkflow?: (workflow: Workflow) => void;
}

export const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  workflows,
  onCreateWorkflow,
  onExecuteWorkflow
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    workflows.forEach(workflow => {
      workflow.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [workflows]);

  // Filter workflows based on search and tags
  const filteredWorkflows = useMemo(() => {
    return workflows.filter(workflow => {
      const matchesSearch = !searchTerm || 
        workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => workflow.tags?.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [workflows, searchTerm, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const renderCommand = (command: string, args?: WorkflowArgument[]) => {
    if (!args || args.length === 0) {
      return command;
    }

    let rendered = command;
    args.forEach(arg => {
      const placeholder = `{{${arg.name}}}`;
      const replacement = `<span class="px-1 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">${arg.name}</span>`;
      rendered = rendered.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
    });

    return rendered;
  };

  const exportWorkflow = (workflow: Workflow) => {
    const yamlContent = `name: ${workflow.name}
command: "${workflow.command}"
${workflow.description ? `description: "${workflow.description}"` : ''}
${workflow.tags ? `tags:\n${workflow.tags.map(tag => `  - ${tag}`).join('\n')}` : ''}
${workflow.arguments ? `arguments:\n${workflow.arguments.map(arg => `  - name: ${arg.name}\n    description: "${arg.description || ''}"`).join('\n')}` : ''}
${workflow.author ? `author: ${workflow.author}` : ''}
${workflow.source_url ? `source_url: "${workflow.source_url}"` : ''}`;

    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.slug}.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Sidebar */}
      <div className="w-80 bg-zinc-900 border-r border-zinc-800 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-200">Workflows</h2>
            {onCreateWorkflow && (
              <Button size="sm" onClick={onCreateWorkflow} className="h-8 px-3">
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search workflows..."
              className="pl-10 bg-zinc-800 border-zinc-700"
            />
          </div>

          {/* Tag Filters */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-zinc-400" />
              <span className="text-sm text-zinc-400">Tags</span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="bg-zinc-700" />

          {/* Workflow List */}
          <div className="space-y-2">
            {filteredWorkflows.map(workflow => (
              <Card
                key={workflow.slug}
                className={`p-3 cursor-pointer transition-colors border-zinc-700 ${
                  selectedWorkflow?.slug === workflow.slug 
                    ? 'bg-zinc-800 border-zinc-600' 
                    : 'bg-zinc-800/50 hover:bg-zinc-800'
                }`}
                onClick={() => setSelectedWorkflow(workflow)}
              >
                <div className="space-y-2">
                  <h3 className="font-medium text-zinc-200 text-sm line-clamp-2">
                    {workflow.name}
                  </h3>
                  {workflow.description && (
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {workflow.description}
                    </p>
                  )}
                  {workflow.tags && (
                    <div className="flex flex-wrap gap-1">
                      {workflow.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {workflow.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{workflow.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedWorkflow ? (
          <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-zinc-200">
                  {selectedWorkflow.name}
                </h1>
                {selectedWorkflow.description && (
                  <p className="text-zinc-400">{selectedWorkflow.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  {selectedWorkflow.author && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedWorkflow.author_url ? (
                        <a 
                          href={selectedWorkflow.author_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-zinc-300"
                        >
                          {selectedWorkflow.author}
                        </a>
                      ) : (
                        selectedWorkflow.author
                      )}
                    </div>
                  )}
                  {selectedWorkflow.source_url && (
                    <a 
                      href={selectedWorkflow.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-zinc-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Source
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportWorkflow(selectedWorkflow)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigator.share?.({ 
                    title: selectedWorkflow.name,
                    text: selectedWorkflow.description,
                    url: window.location.href
                  })}
                >
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
                {onExecuteWorkflow && (
                  <Button 
                    size="sm"
                    onClick={() => onExecuteWorkflow(selectedWorkflow)}
                  >
                    <Terminal className="w-4 h-4 mr-1" />
                    Execute
                  </Button>
                )}
              </div>
            </div>

            {/* Tags */}
            {selectedWorkflow.tags && (
              <div className="flex flex-wrap gap-2">
                {selectedWorkflow.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Command */}
            <Card className="p-4 bg-zinc-900 border-zinc-700">
              <div className="space-y-3">
                <h3 className="font-medium text-zinc-200">Command</h3>
                <div 
                  className="font-mono text-sm bg-black p-3 rounded border border-zinc-700 text-green-400"
                  dangerouslySetInnerHTML={{ 
                    __html: renderCommand(selectedWorkflow.command, selectedWorkflow.arguments) 
                  }}
                />
              </div>
            </Card>

            {/* Arguments */}
            {selectedWorkflow.arguments && selectedWorkflow.arguments.length > 0 && (
              <Card className="p-4 bg-zinc-900 border-zinc-700">
                <div className="space-y-3">
                  <h3 className="font-medium text-zinc-200">Arguments</h3>
                  <div className="space-y-3">
                    {selectedWorkflow.arguments.map(arg => (
                      <div key={arg.name} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                            {arg.name}
                          </code>
                          {arg.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>
                        {arg.description && (
                          <p className="text-sm text-zinc-400 ml-2">{arg.description}</p>
                        )}
                        {arg.default_value && (
                          <p className="text-xs text-zinc-500 ml-2">
                            Default: <code>{arg.default_value}</code>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Shells */}
            {selectedWorkflow.shells && selectedWorkflow.shells.length > 0 && (
              <Card className="p-4 bg-zinc-900 border-zinc-700">
                <div className="space-y-3">
                  <h3 className="font-medium text-zinc-200">Compatible Shells</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkflow.shells.map(shell => (
                      <Badge key={shell} variant="outline">
                        {shell}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-zinc-500">
              <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a workflow to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
