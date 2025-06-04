
interface CommandSuggestion {
  command: string;
  description: string;
}

interface HandlerResponse {
  type: 'greeting' | 'suggestion' | 'translation' | 'edit-confirmation' | 'clear-confirmation' | 'error';
  content: string | CommandSuggestion[];
}

export const unifiedHandler = (input: string): HandlerResponse => {
  const trimmedInput = input.trim();

  // Handle opening AI terminal
  if (trimmedInput === "open AI terminal") {
    return {
      type: 'greeting',
      content: "Welcome to AI Terminal. Type a command to get started."
    };
  }

  // Handle clearing terminal
  if (trimmedInput === "clear terminal") {
    return {
      type: 'clear-confirmation',
      content: "Terminal cleared."
    };
  }

  // Handle command editing
  if (trimmedInput.startsWith("edit:")) {
    const editContent = trimmedInput.substring(5).trim();
    const arrowMatch = editContent.match(/^(.+?)\s*->\s*(.+)$/);
    
    if (arrowMatch) {
      const [, oldCommand, newCommand] = arrowMatch;
      return {
        type: 'edit-confirmation',
        content: `Command updated from "${oldCommand.trim()}" to "${newCommand.trim()}"`
      };
    }
    
    return {
      type: 'error',
      content: "Command not recognized."
    };
  }

  // Natural language to command translation
  const naturalLanguageCommands: Record<string, string> = {
    "show me running containers": "docker ps",
    "list running containers": "docker ps",
    "check running containers": "docker ps",
    "deploy to production": "kubectl apply -f production.yaml && kubectl rollout status deployment/app",
    "check system health": "systemctl status && df -h && free -m",
    "list active processes": "ps aux",
    "list all processes": "ps -ef",
    "show system status": "systemctl status",
    "check disk space": "df -h",
    "check memory usage": "free -m",
    "show network connections": "netstat -tuln",
    "list running services": "systemctl list-units --type=service --state=running",
    "check cpu usage": "top -n 1",
    "show logs": "journalctl -n 50",
    "restart nginx": "systemctl restart nginx",
    "check nginx status": "systemctl status nginx"
  };

  // Check for exact natural language match
  const lowerInput = trimmedInput.toLowerCase();
  if (naturalLanguageCommands[lowerInput]) {
    return {
      type: 'translation',
      content: naturalLanguageCommands[lowerInput]
    };
  }

  // Generate suggestions for partial input (if input looks like it's requesting suggestions)
  if (trimmedInput.length >= 3) {
    const suggestions: CommandSuggestion[] = [];
    
    // Command suggestions based on partial input
    const allCommands = [
      { command: "deploy to production", description: "Deploy application to production environment" },
      { command: "deploy to staging", description: "Deploy application to staging environment" },
      { command: "check system health", description: "Verify system status and resource usage" },
      { command: "check system performance", description: "Analyze system performance metrics" },
      { command: "list active processes", description: "Show currently running processes" },
      { command: "list all processes", description: "Show all system processes" },
      { command: "find slow queries", description: "Identify database performance issues" },
      { command: "find large files", description: "Locate files consuming disk space" },
      { command: "create backup", description: "Create system or database backup" },
      { command: "create deployment", description: "Create new deployment configuration" },
      { command: "show running containers", description: "Display active Docker containers" },
      { command: "show system logs", description: "View recent system log entries" }
    ];

    // Filter commands that start with or contain the input
    const matchingCommands = allCommands.filter(cmd => 
      cmd.command.toLowerCase().includes(lowerInput) ||
      cmd.command.toLowerCase().startsWith(lowerInput)
    );

    // Take up to 5 suggestions
    suggestions.push(...matchingCommands.slice(0, 5));

    if (suggestions.length > 0) {
      return {
        type: 'suggestion',
        content: suggestions
      };
    }
  }

  // If no match found
  return {
    type: 'error',
    content: "Command not recognized."
  };
};

// Helper function to highlight keywords in commands
export const highlightKeywords = (text: string): string => {
  const keywords = ['deploy', 'create', 'find', 'check', 'system', 'list', 'show', 'start', 'stop', 'restart'];
  let highlightedText = text;
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    highlightedText = highlightedText.replace(regex, `**${keyword}**`);
  });
  
  return highlightedText;
};
