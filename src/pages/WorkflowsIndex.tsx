
import React, { useState, useEffect } from 'react';
import { WorkflowManager, type Workflow } from '@/components/WorkflowManager';
import { WorkflowCreator } from '@/components/WorkflowCreator';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';

// Mock workflows data - in real implementation, this would come from the generated files
const mockWorkflows: Workflow[] = [
  {
    name: "Deploy to Production",
    command: "git push origin {{branch}} && npm run deploy:prod",
    description: "Deploy the current branch to production environment",
    tags: ["git", "deployment", "production"],
    arguments: [
      {
        name: "branch",
        description: "Branch to deploy",
        default_value: "main",
        required: true
      }
    ],
    author: "DevOps Team",
    slug: "deploy-to-production"
  },
  {
    name: "Run Docker Container",
    command: "docker run -d --name {{container_name}} -p {{port}}:{{port}} {{image}}",
    description: "Start a Docker container with specified parameters",
    tags: ["docker", "container", "deployment"],
    arguments: [
      {
        name: "container_name",
        description: "Name for the container",
        required: true
      },
      {
        name: "port",
        description: "Port to expose",
        default_value: "3000",
        required: true
      },
      {
        name: "image",
        description: "Docker image to run",
        required: true
      }
    ],
    author: "Platform Team",
    slug: "run-docker-container"
  },
  {
    name: "Database Backup",
    command: "pg_dump {{database}} > backup_$(date +%Y%m%d_%H%M%S).sql",
    description: "Create a timestamped backup of PostgreSQL database",
    tags: ["database", "postgresql", "backup"],
    arguments: [
      {
        name: "database",
        description: "Database name to backup",
        required: true
      }
    ],
    author: "DBA Team",
    slug: "database-backup"
  }
];

export const WorkflowsIndex: React.FC = () => {
  const [view, setView] = useState<'manager' | 'creator'>('manager');
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);

  const handleCreateWorkflow = () => {
    setView('creator');
  };

  const handleSaveWorkflow = (workflowData: any) => {
    const newWorkflow: Workflow = {
      ...workflowData,
      slug: workflowData.name.toLowerCase().replace(/\s+/g, '-'),
      tags: workflowData.tags ? workflowData.tags.split(',').map((t: string) => t.trim()) : []
    };
    
    setWorkflows(prev => [...prev, newWorkflow]);
    setView('manager');
  };

  const handleExecuteWorkflow = (workflow: Workflow) => {
    console.log('Executing workflow:', workflow);
    // In real implementation, this would integrate with the terminal
    alert(`Would execute: ${workflow.command}`);
  };

  if (view === 'creator') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="p-4 border-b border-zinc-800">
          <Button
            variant="ghost"
            onClick={() => setView('manager')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Workflows
          </Button>
        </div>
        <WorkflowCreator
          onSave={handleSaveWorkflow}
          onCancel={() => setView('manager')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <WorkflowManager
        workflows={workflows}
        onCreateWorkflow={handleCreateWorkflow}
        onExecuteWorkflow={handleExecuteWorkflow}
      />
    </div>
  );
};

export default WorkflowsIndex;
