import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  Book
} from 'lucide-react';

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  command?: string;
  expectedOutput?: string;
  validation?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  output?: string;
  type: 'command' | 'validation' | 'manual' | 'checkpoint';
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: 'deployment' | 'debugging' | 'maintenance' | 'setup' | 'database';
  steps: WorkflowStep[];
  currentStepIndex: number;
  status: 'not-started' | 'running' | 'paused' | 'completed' | 'failed';
}

interface WorkflowEngineProps {
  workflow: Workflow;
  onExecuteStep: (stepId: string) => void;
  onPauseWorkflow: () => void;
  onResumeWorkflow: () => void;
  onStopWorkflow: () => void;
  isVisible: boolean;
}

export const WorkflowEngine: React.FC<WorkflowEngineProps> = ({
  workflow,
  onExecuteStep,
  onPauseWorkflow,
  onResumeWorkflow,
  onStopWorkflow,
  isVisible
}) => {
  if (!isVisible) return null;

  const getStepIcon = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'running':
        return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-zinc-600"></div>;
    }
  };

  const getStepTypeColor = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'command':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'validation':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'manual':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'checkpoint':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const completedSteps = workflow.steps.filter(step => step.status === 'completed').length;
  const progress = (completedSteps / workflow.steps.length) * 100;

  return (
    <Card className="p-4 bg-zinc-900 border-zinc-800 border-l-4 border-l-blue-400" role="region" aria-label="Workflow Engine">
      <div className="space-y-4">
        {/* Workflow Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Book className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-medium text-zinc-200">{workflow.name}</h3>
              <p className="text-xs text-zinc-500">{workflow.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {workflow.category}
            </Badge>
            {workflow.status === 'running' ? (
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={onPauseWorkflow} className="h-7 px-2">
                  <Pause className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={onStopWorkflow} className="h-7 px-2">
                  <Square className="w-3 h-3" />
                </Button>
              </div>
            ) : workflow.status === 'paused' ? (
              <Button size="sm" variant="ghost" onClick={onResumeWorkflow} className="h-7 px-2">
                <Play className="w-3 h-3" />
              </Button>
            ) : null}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Progress</span>
            <span>{completedSteps}/{workflow.steps.length} steps</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Workflow Steps */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {workflow.steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-lg border relative transition-colors duration-300
                ${index === workflow.currentStepIndex ? 'bg-zinc-800 border-blue-500/30 animate-fade-in' : 'bg-zinc-800/50 border-zinc-700'}
              `}
            >
              <div className="flex flex-col items-center gap-2 mt-0.5">
                {getStepIcon(step)}
                <span
                  className={`w-2 h-2 rounded-full block mt-1 ${
                    step.status === 'completed' ? 'bg-green-400' :
                    step.status === 'running' ? 'bg-yellow-400 animate-pulse' :
                    step.status === 'failed' ? 'bg-red-400' :
                    'bg-zinc-500'
                  }`}
                  aria-label={
                    step.status === 'completed' ? 'Completed' :
                    step.status === 'running' ? 'Running' :
                    step.status === 'failed' ? 'Failed' :
                    'Pending'
                  }
                  aria-checked={step.status === 'completed'}
                  role="status"
                ></span>
                <span className="text-xs text-zinc-500">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xs font-medium text-zinc-200 truncate">{step.title}</h4>
                  <Badge variant="outline" className={`text-xs ${getStepTypeColor(step.type)}`}>{step.type}</Badge>
                  <span className={`text-xs font-semibold ml-2 ${
                    step.status === 'completed' ? 'text-green-400' :
                    step.status === 'running' ? 'text-yellow-400' :
                    step.status === 'failed' ? 'text-red-400' :
                    'text-zinc-400'
                  }`}>
                    {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mb-2">{step.description}</p>
                {step.command && (
                  <div className="text-xs font-mono bg-black p-2 rounded border border-zinc-700 mb-2">
                    <span className="text-green-400">$ </span>
                    <span className="text-zinc-300">{step.command}</span>
                  </div>
                )}
                {step.output && (
                  <div className="text-xs text-zinc-500 bg-zinc-900 p-2 rounded border border-zinc-700">
                    {step.output}
                  </div>
                )}
              </div>
              {step.status === 'pending' && index === workflow.currentStepIndex && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onExecuteStep(step.id)}
                  className="h-7 px-2"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
