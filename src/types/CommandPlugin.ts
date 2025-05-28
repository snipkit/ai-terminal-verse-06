
export interface CommandPlugin {
  id: string;
  name: string;
  description: string;
  triggerWords: string[];
  category: 'devops' | 'database' | 'git' | 'container' | 'package' | 'cloud' | 'custom';
  promptInstructions: string;
  schema: {
    parameters?: Array<{
      name: string;
      type: 'string' | 'number' | 'boolean' | 'select';
      required: boolean;
      description: string;
      options?: string[];
    }>;
    outputFormat: 'command' | 'script' | 'config';
  };
  postProcessing?: (rawOutput: string, parameters?: Record<string, any>) => {
    command: string;
    explanation: string;
    warnings?: string[];
    requiresConfirmation: boolean;
  };
}

export interface GeneratedCommandBlock {
  id: string;
  pluginId: string;
  originalInput: string;
  generatedCommand: string;
  explanation: string;
  warnings?: string[];
  requiresConfirmation: boolean;
  status: 'pending' | 'confirmed' | 'rejected' | 'executed';
  timestamp: Date;
}
