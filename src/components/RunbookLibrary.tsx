import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Book, 
  Search, 
  Play, 
  Database, 
  Bug, 
  Wrench, 
  Rocket,
  Settings
} from 'lucide-react';
import type { Workflow } from './WorkflowEngine';

interface RunbookLibraryProps {
  onSelectWorkflow: (workflow: Workflow) => void;
  isVisible: boolean;
}

const mockRunbooks: Workflow[] = [
  {
    id: 'deploy-app',
    name: 'Production Deployment',
    description: 'Complete deployment workflow with tests and rollback',
    category: 'deployment',
    currentStepIndex: 0,
    status: 'not-started',
    steps: [
      {
        id: 'test-1',
        title: 'Run Unit Tests',
        description: 'Execute all unit tests to ensure code quality',
        command: 'npm test',
        type: 'command',
        status: 'pending'
      },
      {
        id: 'build-1',
        title: 'Build Production Bundle',
        description: 'Create optimized production build',
        command: 'npm run build',
        type: 'command',
        status: 'pending'
      },
      {
        id: 'deploy-1',
        title: 'Deploy to Staging',
        description: 'Deploy to staging environment for final testing',
        command: 'npm run deploy:staging',
        type: 'command',
        status: 'pending'
      },
      {
        id: 'validate-1',
        title: 'Validate Staging Deployment',
        description: 'Check that staging deployment is working correctly',
        type: 'validation',
        status: 'pending'
      },
      {
        id: 'deploy-2',
        title: 'Deploy to Production',
        description: 'Deploy to production environment',
        command: 'npm run deploy:production',
        type: 'command',
        status: 'pending'
      }
    ]
  },
  {
    id: 'debug-performance',
    name: 'Performance Debugging',
    description: 'Diagnose and fix application performance issues',
    category: 'debugging',
    currentStepIndex: 0,
    status: 'not-started',
    steps: [
      {
        id: 'monitor-1',
        title: 'Check System Resources',
        description: 'Monitor CPU, memory, and disk usage',
        command: 'top -o cpu',
        type: 'command',
        status: 'pending'
      },
      {
        id: 'analyze-1',
        title: 'Analyze Application Logs',
        description: 'Review recent application logs for errors',
        command: 'tail -f /var/log/app.log | grep ERROR',
        type: 'command',
        status: 'pending'
      },
      {
        id: 'profile-1',
        title: 'Run Performance Profiler',
        description: 'Profile application performance',
        command: 'npm run profile',
        type: 'command',
        status: 'pending'
      }
    ]
  },
  {
    id: 'database-maintenance',
    name: 'Database Maintenance',
    description: 'Routine database optimization and backup',
    category: 'database',
    currentStepIndex: 0,
    status: 'not-started',
    steps: [
      {
        id: 'backup-1',
        title: 'Create Database Backup',
        description: 'Create a full backup of the database',
        command: 'pg_dump mydb > backup.sql',
        type: 'command',
        status: 'pending'
      },
      {
        id: 'analyze-2',
        title: 'Analyze Database Performance',
        description: 'Check for slow queries and optimization opportunities',
        command: 'psql -c "SELECT * FROM pg_stat_activity WHERE state = \'active\';"',
        type: 'command',
        status: 'pending'
      },
      {
        id: 'optimize-1',
        title: 'Optimize Database Tables',
        description: 'Run vacuum and analyze on all tables',
        command: 'psql -c "VACUUM ANALYZE;"',
        type: 'command',
        status: 'pending'
      }
    ]
  }
];

export const RunbookLibrary: React.FC<RunbookLibraryProps> = ({
  onSelectWorkflow,
  isVisible
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!isVisible) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'deployment':
        return <Rocket className="w-4 h-4" />;
      case 'debugging':
        return <Bug className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4" />;
      case 'setup':
        return <Settings className="w-4 h-4" />;
      default:
        return <Book className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'deployment':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'debugging':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'database':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'setup':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const filteredRunbooks = mockRunbooks.filter(runbook => {
    const matchesSearch = runbook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         runbook.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || runbook.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(mockRunbooks.map(r => r.category))];

  return (
    <Card className="p-4 bg-zinc-900 border-zinc-800" role="region" aria-label="Runbook Library">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Book className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-medium text-zinc-200">Runbook Library</h3>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search runbooks..."
              className="pl-10 bg-zinc-800 border-zinc-700 text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedCategory === null ? "default" : "ghost"}
              onClick={() => setSelectedCategory(null)}
              className="text-xs h-7"
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "ghost"}
                onClick={() => setSelectedCategory(category)}
                className="text-xs h-7"
              >
                {getCategoryIcon(category)}
                <span className="ml-1 capitalize">{category}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Runbook List */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {filteredRunbooks.map(runbook => (
            <div
              key={runbook.id}
              className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                {getCategoryIcon(runbook.category)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-zinc-200 flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          runbook.status === 'completed' ? 'bg-green-400' :
                          runbook.status === 'running' ? 'bg-yellow-400' :
                          'bg-zinc-500'
                        }`}
                        aria-label={
                          runbook.status === 'completed' ? 'Completed' :
                          runbook.status === 'running' ? 'Running' :
                          'Pending'
                        }
                        aria-checked={runbook.status === 'completed'}
                        role="status"
                      ></span>
                      {runbook.name}
                    </span>
                    <Badge variant="outline" className={`text-xs ${getCategoryColor(runbook.category)}`}>
                      {runbook.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-400">{runbook.description}</p>
                  <p className="text-xs text-zinc-500 mt-1">{runbook.steps.length} steps</p>
                </div>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onSelectWorkflow(runbook)}
                className="h-7 px-2"
              >
                <Play className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
