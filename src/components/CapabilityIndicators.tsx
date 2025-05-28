
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Code, 
  Zap, 
  Brain, 
  Eye, 
  Shield, 
  Cpu, 
  Network,
  CheckCircle 
} from 'lucide-react';

interface Capability {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'available' | 'disabled';
  category: 'ai' | 'editing' | 'security' | 'performance';
}

interface CapabilityIndicatorsProps {
  capabilities?: Capability[];
  compact?: boolean;
}

const defaultCapabilities: Capability[] = [
  {
    id: 'ai-suggestions',
    name: 'AI Suggestions',
    description: 'Smart command completion and suggestions',
    icon: <Sparkles className="w-4 h-4" />,
    status: 'active',
    category: 'ai'
  },
  {
    id: 'syntax-highlighting',
    name: 'Syntax Highlighting',
    description: 'Real-time code syntax coloring',
    icon: <Code className="w-4 h-4" />,
    status: 'active',
    category: 'editing'
  },
  {
    id: 'natural-language',
    name: 'Natural Language',
    description: 'Human-like command interpretation',
    icon: <Brain className="w-4 h-4" />,
    status: 'active',
    category: 'ai'
  },
  {
    id: 'inline-editing',
    name: 'Inline Editing',
    description: 'Edit commands in place with visual feedback',
    icon: <Eye className="w-4 h-4" />,
    status: 'active',
    category: 'editing'
  },
  {
    id: 'security-scan',
    name: 'Security Scanning',
    description: 'Real-time command security validation',
    icon: <Shield className="w-4 h-4" />,
    status: 'available',
    category: 'security'
  },
  {
    id: 'performance-monitor',
    name: 'Performance Monitor',
    description: 'Command execution performance tracking',
    icon: <Cpu className="w-4 h-4" />,
    status: 'available',
    category: 'performance'
  }
];

export const CapabilityIndicators: React.FC<CapabilityIndicatorsProps> = ({
  capabilities = defaultCapabilities,
  compact = false
}) => {
  const getStatusColor = (status: Capability['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'available':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'disabled':
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const getCategoryColor = (category: Capability['category']) => {
    switch (category) {
      case 'ai':
        return 'text-blue-400';
      case 'editing':
        return 'text-green-400';
      case 'security':
        return 'text-red-400';
      case 'performance':
        return 'text-yellow-400';
      default:
        return 'text-zinc-400';
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {capabilities.filter(cap => cap.status === 'active').map((capability) => (
          <Badge
            key={capability.id}
            variant="outline"
            className={`${getStatusColor(capability.status)} text-xs`}
          >
            {capability.icon}
            <span className="ml-1">{capability.name}</span>
          </Badge>
        ))}
      </div>
    );
  }

  const groupedCapabilities = capabilities.reduce((acc, capability) => {
    if (!acc[capability.category]) {
      acc[capability.category] = [];
    }
    acc[capability.category].push(capability);
    return acc;
  }, {} as Record<string, Capability[]>);

  return (
    <Card className="p-4 bg-zinc-900 border-zinc-800">
      <div className="flex items-center gap-2 mb-3">
        <Network className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium text-zinc-200">System Capabilities</h3>
      </div>
      
      <div className="space-y-3">
        {Object.entries(groupedCapabilities).map(([category, caps]) => (
          <div key={category} className="space-y-2">
            <h4 className={`text-xs font-medium uppercase tracking-wide ${getCategoryColor(category as Capability['category'])}`}>
              {category}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {caps.map((capability) => (
                <div
                  key={capability.id}
                  className="flex items-center justify-between p-2 bg-zinc-800 rounded border border-zinc-700"
                >
                  <div className="flex items-center gap-2">
                    <div className={getCategoryColor(capability.category)}>
                      {capability.icon}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-zinc-200">
                        {capability.name}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {capability.description}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(capability.status)} text-xs`}
                  >
                    {capability.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {capability.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
