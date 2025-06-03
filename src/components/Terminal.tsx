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
import { CommandPalette, CommandPaletteAction } from './CommandPalette';
import { FileBrowser } from './FileBrowser';
import { CodeViewer } from './CodeViewer';
import { SmartSuggestions } from './SmartSuggestions';
import { ProjectProfiles } from './ProjectProfiles';
import { EnhancedHistory } from './EnhancedHistory';

interface ProjectProfile {
  id: string;
  name: string;
  description: string;
  enabledPlugins: string[];
  theme: string;
  aliases: Record<string, string>;
  envVars: Record<string, string>;
  isFavorite: boolean;
  lastUsed: Date;
}

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
    handleTogglePlugin,
    isFileBrowsing,
    setIsFileBrowsing,
    currentPath,
    setCurrentPath,
    selectedFile,
    setSelectedFile,
    setMessages
  } = useTerminalLogic();

  // New state for enhanced features
  const [runbooksVisible, setRunbooksVisible] = useState(false);
  const [workflowsVisible, setWorkflowsVisible] = useState(false);
  const [commandGeneratorVisible, setCommandGeneratorVisible] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [profilesVisible, setProfilesVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [smartSuggestionsVisible, setSmartSuggestionsVisible] = useState(true);
  const [currentProfile, setCurrentProfile] = useState<ProjectProfile | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const [lastError, setLastError] = useState<string>('');

  // Workflow handler functions
  const handleWorkflowExecuteStep = (stepId: string) => {
    console.log('Executing workflow step:', stepId);
    // Implementation for workflow step execution
  };

  const handleWorkflowPause = () => {
    console.log('Pausing workflow');
    if (currentWorkflow) {
      setCurrentWorkflow({ ...currentWorkflow, status: 'paused' });
    }
  };

  const handleWorkflowResume = () => {
    console.log('Resuming workflow');
    if (currentWorkflow) {
      setCurrentWorkflow({ ...currentWorkflow, status: 'running' });
    }
  };

  const handleWorkflowStop = () => {
    console.log('Stopping workflow');
    if (currentWorkflow) {
      setCurrentWorkflow({ ...currentWorkflow, status: 'failed' });
    }
  };

  // Keyboard shortcut for command palette
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Command Palette: Cmd/Ctrl+P
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p' && !e.shiftKey) {
        e.preventDefault();
        setPaletteOpen(true);
      }
      // Clear Messages: Cmd/Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        clearMessages();
      }
      // Toggle Agent Mode: Cmd/Ctrl+Shift+A
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAgentMode((prev) => !prev);
      }
      // Focus Command Input: Cmd/Ctrl+I
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        const input = document.querySelector('input[placeholder="Enter your AI prompt..."]') as HTMLInputElement;
        if (input) input.focus();
      }
      // Open Plugin Manager: Cmd/Ctrl+Shift+P
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setPluginManagerVisible((prev) => !prev);
      }
      // Open History: Cmd/Ctrl+H
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setHistoryVisible(true);
      }
      // Open Profiles: Cmd/Ctrl+Shift+O
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setProfilesVisible(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [clearMessages, setAgentMode, setPluginManagerVisible]);

  const paletteActions: CommandPaletteAction[] = [
    {
      label: `Switch Model (${selectedModel})`,
      onSelect: () => setSelectedModel(selectedModel === 'gpt-4' ? 'gpt-3.5' : 'gpt-4'),
    },
    {
      label: agentMode ? 'Disable Agent Mode' : 'Enable Agent Mode',
      onSelect: () => setAgentMode(!agentMode),
    },
    {
      label: pluginManagerVisible ? 'Hide Plugin Manager' : 'Show Plugin Manager',
      onSelect: () => setPluginManagerVisible(!pluginManagerVisible),
    },
    {
      label: commandGeneratorVisible ? 'Hide Command Generator' : 'Show Command Generator',
      onSelect: () => setCommandGeneratorVisible(!commandGeneratorVisible),
    },
    {
      label: runbooksVisible ? 'Hide Runbook Library' : 'Show Runbook Library',
      onSelect: () => setRunbooksVisible(!runbooksVisible),
    },
    {
      label: workflowsVisible ? 'Hide Workflow Engine' : 'Show Workflow Engine',
      onSelect: () => setWorkflowsVisible(!workflowsVisible),
    },
    {
      label: 'Open Project Profiles',
      onSelect: () => setProfilesVisible(true),
    },
    {
      label: 'Open Command History',
      onSelect: () => setHistoryVisible(true),
    },
    {
      label: 'Clear Messages',
      onSelect: clearMessages,
    },
  ];

  const handleSelectWorkflow = (workflow: Workflow) => {
    setCurrentWorkflow({ ...workflow, status: 'running' });
    setWorkflowsVisible(true);
    setRunbooksVisible(false);
  };

  const handleSelectProfile = (profile: ProjectProfile) => {
    setCurrentProfile(profile);
    // Apply profile settings
    profile.enabledPlugins.forEach(pluginId => {
      handleTogglePlugin(pluginId, true);
    });
    // You could also apply theme, aliases, etc. here
  };

  const handleEnhancedCommand = (command: string) => {
    setRecentCommands(prev => [command, ...prev.slice(0, 9)]); // Keep last 10 commands
    setCurrentInput('');
    handleCommand(command);
  };

  const handleSuggestionSelect = (command: string) => {
    setCurrentInput(command);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} actions={paletteActions} />
      <ProjectProfiles
        isVisible={profilesVisible}
        onClose={() => setProfilesVisible(false)}
        onSelectProfile={handleSelectProfile}
        currentProfile={currentProfile}
      />
      <EnhancedHistory
        isVisible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        onExecuteCommand={handleEnhancedCommand}
      />
      
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
        
        <TerminalBody
          isFileBrowsing={isFileBrowsing}
          currentPath={currentPath}
          selectedFile={selectedFile}
          setIsFileBrowsing={setIsFileBrowsing}
          setCurrentPath={setCurrentPath}
          setSelectedFile={setSelectedFile}
        >
          {/* Render file browser or messages based on isFileBrowsing state */}
          {isFileBrowsing ? (
            selectedFile ? (
              <CodeViewer filePath={selectedFile} setSelectedFile={setSelectedFile} />
            ) : (
              <FileBrowser
                currentPath={currentPath}
                setCurrentPath={setCurrentPath}
                setSelectedFile={setSelectedFile}
              />
            )
          ) : (
            <>
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
                onCopy={copyToClipboard}
                onRerun={(command) => handleCommand(command)}
                onDelete={(id) => {
                  const idx = parseInt(id, 10);
                  if (!isNaN(idx)) {
                    setMessages(prevMessages => {
                      const newMessages = [...prevMessages];
                      newMessages.splice(idx, 1);
                      return newMessages;
                    });
                  }
                }}
              />
            </>
          )}
        </TerminalBody>
        
        <div className="relative">
          <SmartSuggestions
            currentInput={currentInput}
            recentCommands={recentCommands}
            lastError={lastError}
            onSelectSuggestion={handleSuggestionSelect}
            isVisible={smartSuggestionsVisible && currentInput.length > 2}
          />
          <TerminalInputArea onSubmit={handleEnhancedCommand} />
        </div>
      </TerminalContainer>
    </>
  );
};
