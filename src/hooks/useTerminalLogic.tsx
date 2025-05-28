
import { useState, useRef, useEffect } from 'react';

export type AgentStep = {
  id: string;
  description: string;
  command?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
};

export type Message = {
  type: 'input' | 'response' | 'agent-response';
  content: string;
  model: string;
  timestamp: Date;
  steps?: AgentStep[];
};

export type CorrectionAttempt = {
  id: string;
  originalError: string;
  correctionStrategy: string;
  status: 'attempting' | 'success' | 'failed';
  timestamp: Date;
};

export const useTerminalLogic = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [agentMode, setAgentMode] = useState(false);
  const [agentRunning, setAgentRunning] = useState(false);
  const [corrections, setCorrections] = useState<CorrectionAttempt[]>([]);
  const [dataTransmissionVisible, setDataTransmissionVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateNaturalLanguageDetection = (command: string): boolean => {
    // Simple detection for demo - in real app this would be more sophisticated
    const naturalLanguagePatterns = [
      /^(create|make|build|generate)/i,
      /^(show|display|list)/i,
      /^(find|search|look for)/i,
      /^(help|how do|can you)/i
    ];
    
    return naturalLanguagePatterns.some(pattern => pattern.test(command));
  };

  const simulateSelfCorrection = (error: string) => {
    const correctionId = Date.now().toString();
    const correction: CorrectionAttempt = {
      id: correctionId,
      originalError: error,
      correctionStrategy: 'Analyzing command syntax and retrying with corrected parameters',
      status: 'attempting',
      timestamp: new Date()
    };

    setCorrections(prev => [...prev, correction]);

    // Simulate correction process
    setTimeout(() => {
      setCorrections(prev => prev.map(c => 
        c.id === correctionId 
          ? { ...c, status: Math.random() > 0.3 ? 'success' : 'failed' as const }
          : c
      ));
    }, 2000);
  };

  const simulateAgentResponse = (command: string): AgentStep[] => {
    // Simulate agent breaking down tasks into steps
    if (command.toLowerCase().includes('create') && command.toLowerCase().includes('component')) {
      return [
        { id: '1', description: 'Analyze component requirements', status: 'pending' },
        { id: '2', description: 'Generate component structure', command: 'mkdir components', status: 'pending' },
        { id: '3', description: 'Create TypeScript interfaces', status: 'pending' },
        { id: '4', description: 'Implement component logic', status: 'pending' },
        { id: '5', description: 'Add styling and exports', status: 'pending' }
      ];
    }
    
    if (command.toLowerCase().includes('deploy') || command.toLowerCase().includes('build')) {
      return [
        { id: '1', description: 'Run tests and linting', command: 'npm run test', status: 'pending' },
        { id: '2', description: 'Build production bundle', command: 'npm run build', status: 'pending' },
        { id: '3', description: 'Optimize assets', status: 'pending' },
        { id: '4', description: 'Deploy to production', command: 'npm run deploy', status: 'pending' }
      ];
    }

    return [];
  };

  const handleCommand = async (command: string) => {
    if (!command.trim()) return;

    // Show data transmission indicator
    setDataTransmissionVisible(true);
    setTimeout(() => setDataTransmissionVisible(false), 1000);

    // Natural language detection
    const isNaturalLanguage = simulateNaturalLanguageDetection(command);
    
    // Add user input to messages
    setMessages(prev => [...prev, {
      type: 'input',
      content: `${isNaturalLanguage ? '🧠 ' : ''}${command}`,
      model: selectedModel,
      timestamp: new Date()
    }]);

    // Simulate potential error and self-correction
    if (command.toLowerCase().includes('error') && Math.random() > 0.5) {
      simulateSelfCorrection('Command execution failed: Invalid syntax');
    }

    // Simulate AI response
    setTimeout(() => {
      if (agentMode) {
        const steps = simulateAgentResponse(command);
        const agentResponse = steps.length > 0 
          ? `I'll help you with: ${command}\n\nI've broken this down into ${steps.length} executable steps. Each step can be executed with your permission.`
          : `Processing: ${command}\n\nThis is an Agent Mode response with enhanced reasoning and task breakdown capabilities.`;

        setMessages(prev => [...prev, {
          type: 'agent-response',
          content: agentResponse,
          model: selectedModel,
          timestamp: new Date(),
          steps
        }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'response',
          content: `Response to: ${command}\nThis is a standard AI response from ${selectedModel}`,
          model: selectedModel,
          timestamp: new Date()
        }]);
      }
    }, 1000);
  };

  const handleExecuteStep = (stepId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.type === 'agent-response' && msg.steps) {
        const updatedSteps = msg.steps.map(step => 
          step.id === stepId 
            ? { ...step, status: 'running' as const }
            : step
        );
        
        // Simulate step completion
        setTimeout(() => {
          setMessages(prevMsgs => prevMsgs.map(prevMsg => {
            if (prevMsg.type === 'agent-response' && prevMsg.steps) {
              return {
                ...prevMsg,
                steps: prevMsg.steps.map(step => 
                  step.id === stepId 
                    ? { ...step, status: 'completed' as const, output: `✓ Step completed successfully` }
                    : step
                )
              };
            }
            return prevMsg;
          }));
        }, 2000);

        return { ...msg, steps: updatedSteps };
      }
      return msg;
    }));
  };

  const handleAgentPause = () => {
    setAgentRunning(false);
    console.log('Agent Mode paused');
  };

  const handleAgentResume = () => {
    setAgentRunning(true);
    console.log('Agent Mode resumed');
  };

  const handleAgentStop = () => {
    setAgentRunning(false);
    setAgentMode(false);
    console.log('Agent Mode stopped');
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
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
  };
};
