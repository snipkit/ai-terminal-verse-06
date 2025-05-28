import { useState, useRef, useEffect } from 'react';
import { CommandPlugin, GeneratedCommandBlock } from '@/types/CommandPlugin';
import { builtInPlugins } from '@/plugins/builtInPlugins';

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
  const [enabledPlugins, setEnabledPlugins] = useState<string[]>(['kubectl', 'git', 'docker', 'npm']);
  const [commandBlocks, setCommandBlocks] = useState<GeneratedCommandBlock[]>([]);
  const [pluginManagerVisible, setPluginManagerVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const detectNaturalLanguage = (input: string): boolean => {
    // Enhanced natural language detection for Agent Mode
    const naturalLanguagePatterns = [
      /^(create|make|build|generate|setup|configure)/i,
      /^(show|display|list|find|search|get)/i,
      /^(deploy|install|update|upgrade|remove)/i,
      /^(help|how do|can you|please)/i,
      /^(check|verify|test|debug|troubleshoot)/i,
      /\b(please|could you|would you|can you)\b/i,
      /\?(.*)/,  // Questions
      /\b(want to|need to|trying to)\b/i
    ];
    
    // Check if input contains trigger words from enabled plugins
    const enabledPluginObjects = builtInPlugins.filter(p => enabledPlugins.includes(p.id));
    const hasTriggerWords = enabledPluginObjects.some(plugin => 
      plugin.triggerWords.some(word => 
        input.toLowerCase().includes(word.toLowerCase())
      )
    );
    
    return naturalLanguagePatterns.some(pattern => pattern.test(input)) || hasTriggerWords;
  };

  const findMatchingPlugin = (input: string): CommandPlugin | null => {
    const enabledPluginObjects = builtInPlugins.filter(p => enabledPlugins.includes(p.id));
    
    // Score plugins based on trigger word matches
    const pluginScores = enabledPluginObjects.map(plugin => {
      const matches = plugin.triggerWords.filter(word => 
        input.toLowerCase().includes(word.toLowerCase())
      ).length;
      return { plugin, score: matches };
    });
    
    // Return the plugin with the highest score, or null if no matches
    const bestMatch = pluginScores.reduce((best, current) => 
      current.score > best.score ? current : best, { plugin: null, score: 0 }
    );
    
    return bestMatch.score > 0 ? bestMatch.plugin : null;
  };

  const generateCommandFromNaturalLanguage = (input: string, plugin: CommandPlugin): GeneratedCommandBlock => {
    // Simulate LLM processing with plugin-specific instructions
    const mockCommands: Record<string, string> = {
      'kubectl': `kubectl get pods --all-namespaces`,
      'git': `git status && git log --oneline -5`,
      'docker': `docker ps -a`,
      'npm': `npm audit --audit-level moderate`
    };

    // In a real implementation, this would call an LLM API with the plugin's prompt instructions
    const generatedCommand = mockCommands[plugin.id] || `echo "Generated command for: ${input}"`;
    
    const postProcessed = plugin.postProcessing 
      ? plugin.postProcessing(generatedCommand)
      : {
          command: generatedCommand,
          explanation: `Generated ${plugin.name} command`,
          requiresConfirmation: false
        };

    const commandBlock: GeneratedCommandBlock = {
      id: Date.now().toString(),
      pluginId: plugin.id,
      originalInput: input,
      generatedCommand: postProcessed.command,
      explanation: postProcessed.explanation,
      warnings: postProcessed.warnings,
      requiresConfirmation: postProcessed.requiresConfirmation,
      status: postProcessed.requiresConfirmation ? 'pending' : 'confirmed',
      timestamp: new Date()
    };

    return commandBlock;
  };

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

    // In Agent Mode, intercept natural language and route through LLM
    if (agentMode && detectNaturalLanguage(command)) {
      const matchingPlugin = findMatchingPlugin(command);
      
      if (matchingPlugin) {
        const commandBlock = generateCommandFromNaturalLanguage(command, matchingPlugin);
        setCommandBlocks(prev => [commandBlock, ...prev]);
        
        // Add a message showing the command block was generated
        setMessages(prev => [...prev, {
          type: 'input',
          content: `🧠 ${command}`,
          model: selectedModel,
          timestamp: new Date()
        }]);

        setMessages(prev => [...prev, {
          type: 'agent-response',
          content: `I've generated a ${matchingPlugin.name} command block for your request. ${commandBlock.requiresConfirmation ? 'Please review and confirm before execution.' : 'The command is ready for execution.'}`,
          model: selectedModel,
          timestamp: new Date()
        }]);

        return;
      }
    }

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

  const handleCommandBlockConfirm = (blockId: string) => {
    setCommandBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, status: 'confirmed' } : block
    ));
  };

  const handleCommandBlockReject = (blockId: string) => {
    setCommandBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, status: 'rejected' } : block
    ));
  };

  const handleCommandBlockExecute = (blockId: string) => {
    const block = commandBlocks.find(b => b.id === blockId);
    if (block) {
      setCommandBlocks(prev => prev.map(b => 
        b.id === blockId ? { ...b, status: 'executed' } : b
      ));
      
      // Execute the actual command
      handleCommand(block.generatedCommand);
    }
  };

  const handleTogglePlugin = (pluginId: string, enabled: boolean) => {
    setEnabledPlugins(prev => 
      enabled 
        ? [...prev, pluginId]
        : prev.filter(id => id !== pluginId)
    );
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
    clearMessages,
    
    enabledPlugins,
    commandBlocks,
    pluginManagerVisible,
    setPluginManagerVisible,
    handleCommandBlockConfirm,
    handleCommandBlockReject,
    handleCommandBlockExecute,
    handleTogglePlugin
  };
};
