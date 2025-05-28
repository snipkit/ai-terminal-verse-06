
import React from 'react';
import { TerminalHeader } from './TerminalHeader';
import { TerminalMessages } from './TerminalMessages';
import { TerminalInputArea } from './TerminalInputArea';
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

  return (
    <div className="w-full max-w-6xl mx-auto mt-4">
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
      />
      
      <div className="bg-black border border-zinc-800 border-t-0 rounded-b-xl">
        <TerminalMessages
          messages={messages}
          corrections={corrections}
          agentMode={agentMode}
          scrollRef={scrollRef}
          onExecuteStep={handleExecuteStep}
        />
        
        <TerminalInputArea onSubmit={handleCommand} />
      </div>
    </div>
  );
};
