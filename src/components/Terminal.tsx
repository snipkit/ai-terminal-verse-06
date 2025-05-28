
import React, { useState } from 'react';
import { TerminalHeader } from './TerminalHeader';
import { TerminalMessages } from './TerminalMessages';
import { TerminalInputArea } from './TerminalInputArea';
import { TerminalContainer } from './TerminalContainer';
import { TerminalBody } from './TerminalBody';
import { WorkflowEngine, type Workflow } from './WorkflowEngine';
import { RunbookLibrary } from './RunbookLibrary';
import { CommandGenerator } from './CommandGenerator';
import { useTerminalLogic } from '@/hooks/useTerminalLogic';

export const Terminal = () => {
  const {
    messages,
    selectedModel,
    setSelectedModel,
    agentMode,
    setAgentMode,
    agentRunning,
    corrections,
    dataTransmissionVisible,
    scrollRef,
    handleCommand,
    handleExecuteStep,
    handleAgentPause,
    handleAgentResume,
    handleAgentStop,
    clearMessages
  } = useTerminalLogic();

  // New state for workflow features
  const [runbooksVisible, setRunbooksVisible] = useState(false);
  const [workflowsVisible, setWorkflowsVisible] = useState(false);
  const [commandGeneratorVisible, setCommandGeneratorVisible] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);

  const handleSelectWorkflow = (workflow: Workflow) => {
    setCurrentWorkflow({ ...workflow, status: 'running' });
    setWorkflowsVisible(true);
    setRunbooksVisible(false);
  };

  const handleWorkflowExecuteStep = (stepId: string) => {
    if (!currentWorkflow) return;
    
    const updatedWorkflow = { ...currentWorkflow };
    const stepIndex = updatedWorkflow.steps.findIndex(step => step.id === stepId);
    
    if (stepIndex !== -1) {
      updatedWorkflow.steps[stepIndex].status = 'running';
      updatedWorkflow.currentStepIndex = stepIndex;
      setCurrentWorkflow(updatedWorkflow);
      
      // Execute the command if it exists
      if (updatedWorkflow.steps[stepIndex].command) {
        handleCommand(updatedWorkflow.steps[stepIndex].command!);
      }
      
      // Simulate step completion
      setTimeout(() => {
        const completedWorkflow = { ...updatedWorkflow };
        completedWorkflow.steps[stepIndex].status = 'completed';
        completedWorkflow.steps[stepIndex].output = '✓ Step completed successfully';
        
        // Move to next step
        if (stepIndex < completedWorkflow.steps.length - 1) {
          completedWorkflow.currentStepIndex = stepIndex + 1;
        } else {
          completedWorkflow.status = 'completed';
        }
        
        setCurrentWorkflow(completedWorkflow);
      }, 2000);
    }
  };

  const handleWorkflowPause = () => {
    if (currentWorkflow) {
      setCurrentWorkflow({ ...currentWorkflow, status: 'paused' });
    }
  };

  const handleWorkflowResume = () => {
    if (currentWorkflow) {
      setCurrentWorkflow({ ...currentWorkflow, status: 'running' });
    }
  };

  const handleWorkflowStop = () => {
    setCurrentWorkflow(null);
    setWorkflowsVisible(false);
  };

  return (
    <TerminalContainer>
      <TerminalHeader
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        agentMode={agentMode}
        onAgentModeToggle={setAgentMode}
        agentRunning={agentRunning}
        onAgentPause={handleAgentPause}
        onAgentResume={handleAgentResume}
        onAgentStop={handleAgentStop}
        onClearMessages={clearMessages}
        dataTransmissionVisible={dataTransmissionVisible}
        onToggleRunbooks={() => setRunbooksVisible(!runbooksVisible)}
        onToggleWorkflows={() => setWorkflowsVisible(!workflowsVisible)}
        onToggleCommandGenerator={() => setCommandGeneratorVisible(!commandGeneratorVisible)}
        runbooksVisible={runbooksVisible}
        workflowsVisible={workflowsVisible}
        commandGeneratorVisible={commandGeneratorVisible}
      />
      
      <TerminalBody>
        {/* Workflow and Runbook panels */}
        <div className="space-y-4 p-4">
          <CommandGenerator 
            onExecuteCommand={handleCommand}
            isVisible={commandGeneratorVisible}
          />
          
          <RunbookLibrary 
            onSelectWorkflow={handleSelectWorkflow}
            isVisible={runbooksVisible}
          />
          
          {currentWorkflow && (
            <WorkflowEngine
              workflow={currentWorkflow}
              onExecuteStep={handleWorkflowExecuteStep}
              onPauseWorkflow={handleWorkflowPause}
              onResumeWorkflow={handleWorkflowResume}
              onStopWorkflow={handleWorkflowStop}
              isVisible={workflowsVisible}
            />
          )}
        </div>
        
        <TerminalMessages
          messages={messages}
          corrections={corrections}
          agentMode={agentMode}
          scrollRef={scrollRef}
          onExecuteStep={handleExecuteStep}
        />
        
        <TerminalInputArea onSubmit={handleCommand} />
      </TerminalBody>
    </TerminalContainer>
  );
};
