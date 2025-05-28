
import { CommandPlugin } from '@/types/CommandPlugin';

export const kubernetesPlugin: CommandPlugin = {
  id: 'kubectl',
  name: 'Kubernetes',
  description: 'Generate kubectl commands for container orchestration',
  triggerWords: ['kubectl', 'kubernetes', 'k8s', 'pod', 'deployment', 'service', 'namespace'],
  category: 'devops',
  promptInstructions: `
    Generate kubectl commands based on the user's natural language request.
    Consider common operations like:
    - Creating, updating, deleting resources
    - Viewing logs, describing resources
    - Port forwarding, scaling
    - Troubleshooting and debugging
    
    Always include proper namespace handling and resource specifications.
  `,
  schema: {
    outputFormat: 'command'
  },
  postProcessing: (rawOutput: string) => {
    const warnings = [];
    if (rawOutput.includes('delete')) {
      warnings.push('This command will delete resources - use with caution');
    }
    if (rawOutput.includes('--force')) {
      warnings.push('Force flag detected - this bypasses safety checks');
    }
    
    return {
      command: rawOutput.trim(),
      explanation: 'Generated kubectl command for Kubernetes operations',
      warnings,
      requiresConfirmation: rawOutput.includes('delete') || rawOutput.includes('--force')
    };
  }
};

export const gitPlugin: CommandPlugin = {
  id: 'git',
  name: 'Git',
  description: 'Generate Git commands for version control operations',
  triggerWords: ['git', 'commit', 'branch', 'merge', 'rebase', 'push', 'pull'],
  category: 'git',
  promptInstructions: `
    Generate Git commands for version control operations.
    Consider common workflows like:
    - Creating and switching branches
    - Committing changes with proper messages
    - Merging and rebasing
    - Remote operations (push, pull, fetch)
    - Viewing history and diffs
    
    Always use safe practices and clear commit messages.
  `,
  schema: {
    outputFormat: 'command'
  },
  postProcessing: (rawOutput: string) => {
    const warnings = [];
    if (rawOutput.includes('--force') || rawOutput.includes('-f')) {
      warnings.push('Force flag detected - this can overwrite history');
    }
    if (rawOutput.includes('reset --hard')) {
      warnings.push('Hard reset will lose uncommitted changes');
    }
    
    return {
      command: rawOutput.trim(),
      explanation: 'Generated Git command for version control',
      warnings,
      requiresConfirmation: warnings.length > 0
    };
  }
};

export const dockerPlugin: CommandPlugin = {
  id: 'docker',
  name: 'Docker',
  description: 'Generate Docker commands for container management',
  triggerWords: ['docker', 'container', 'image', 'dockerfile', 'compose'],
  category: 'container',
  promptInstructions: `
    Generate Docker commands for container operations.
    Consider common operations like:
    - Building and running containers
    - Managing images and volumes
    - Container inspection and logs
    - Docker Compose operations
    - Cleanup and maintenance
    
    Always consider resource usage and security best practices.
  `,
  schema: {
    outputFormat: 'command'
  },
  postProcessing: (rawOutput: string) => {
    const warnings = [];
    if (rawOutput.includes('--privileged')) {
      warnings.push('Privileged mode grants extensive container permissions');
    }
    if (rawOutput.includes('system prune')) {
      warnings.push('Prune commands will remove unused Docker resources');
    }
    
    return {
      command: rawOutput.trim(),
      explanation: 'Generated Docker command for container management',
      warnings,
      requiresConfirmation: warnings.length > 0
    };
  }
};

export const npmPlugin: CommandPlugin = {
  id: 'npm',
  name: 'NPM',
  description: 'Generate npm commands for package management',
  triggerWords: ['npm', 'package', 'install', 'uninstall', 'update', 'audit'],
  category: 'package',
  promptInstructions: `
    Generate npm commands for JavaScript package management.
    Consider common operations like:
    - Installing and removing packages
    - Updating dependencies
    - Running scripts
    - Security audits
    - Version management
    
    Always consider package security and version compatibility.
  `,
  schema: {
    outputFormat: 'command'
  },
  postProcessing: (rawOutput: string) => {
    const warnings = [];
    if (rawOutput.includes('--force')) {
      warnings.push('Force flag bypasses dependency resolution checks');
    }
    if (rawOutput.includes('npm audit fix')) {
      warnings.push('Auto-fix may update package versions');
    }
    
    return {
      command: rawOutput.trim(),
      explanation: 'Generated npm command for package management',
      warnings,
      requiresConfirmation: warnings.length > 0
    };
  }
};

export const builtInPlugins: CommandPlugin[] = [
  kubernetesPlugin,
  gitPlugin,
  dockerPlugin,
  npmPlugin
];
