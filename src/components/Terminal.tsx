import React, { useState } from 'react';
import { TerminalHeader } from './TerminalHeader';
import { TerminalMessages } from './TerminalMessages';
import { TerminalInputArea } from './TerminalInputArea';
import { TerminalContainer } from './TerminalContainer';
import { TerminalBody } from './TerminalBody';
import { WorkflowEngine, type Workflow } from './WorkflowEngine';
import { RunbookLibrary } from './RunbookLibrary';
import { CommandGenerator } from './CommandGenerator';
import { CommandBlockConfirmation } from './CommandBlockConfirmation';
import { PluginManager } from './PluginManager';
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
    clearMessages,
    enabledPlugins,
    commandBlocks,
    pluginManagerVisible,
    setPluginManagerVisible,
    handleCommandBlockConfirm,
    handleCommandBlockReject,
    handleCommandBlockExecute,
    handleTogglePlugin
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
      
      if (updatedWorkflow.steps[stepIndex].command) {
        handleCommand(updatedWorkflow.steps[stepIndex].command!);
      }
      
      setTimeout(() => {
        const completedWorkflow = { ...updatedWorkflow };
        completedWorkflow.steps[stepIndex].status = 'completed';
        completedWorkflow.steps[stepIndex].output = '✓ Step completed successfully';
        
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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
        onTogglePluginManager={() => setPluginManagerVisible(!pluginManagerVisible)}
        runbooksVisible={runbooksVisible}
        workflowsVisible={workflowsVisible}
        commandGeneratorVisible={commandGeneratorVisible}
        pluginManagerVisible={pluginManagerVisible}
      />
      
      <TerminalBody>
        {/* Plugin and workflow panels */}
        <div className="space-y-4 p-4">
          <PluginManager
            enabledPlugins={enabledPlugins}
            onTogglePlugin={handleTogglePlugin}
            isVisible={pluginManagerVisible}
          />
          
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
          
          {/* Command blocks generated in Agent Mode */}
          {commandBlocks.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-zinc-300">Generated Command Blocks</h4>
              {commandBlocks.slice(0, 5).map((block) => (
                <CommandBlockConfirmation
                  key={block.id}
                  commandBlock={block}
                  onConfirm={handleCommandBlockConfirm}
                  onReject={handleCommandBlockReject}
                  onExecute={handleCommandBlockExecute}
                  onCopy={copyToClipboard}
                />
              ))}
            </div>
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
