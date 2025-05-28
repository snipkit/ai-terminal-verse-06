
import React from 'react';
import { TerminalHeader } from './TerminalHeader';
import { TerminalMessages } from './TerminalMessages';
import { TerminalInputArea } from './TerminalInputArea';
import { TerminalContainer } from './TerminalContainer';
import { TerminalBody } from './TerminalBody';
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
      />
      
      <TerminalBody>
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
