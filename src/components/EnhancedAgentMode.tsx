
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bot, Zap, Settings, Pause, Play, Square } from 'lucide-react';
import { NaturalLanguageDetection } from './NaturalLanguageDetection';
import { TransparencyControls } from './TransparencyControls';

interface EnhancedAgentModeProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  isRunning: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const EnhancedAgentMode: React.FC<EnhancedAgentModeProps> = ({
  isEnabled,
  onToggle,
  isRunning,
  onPause,
  onResume,
  onStop
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [nlDetectionEnabled, setNlDetectionEnabled] = useState(true);
  const [denylist, setDenylist] = useState(['rm -rf', 'sudo rm', 'format', 'delete']);
  const [showDataTransmission, setShowDataTransmission] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [showSensitivityWarnings, setShowSensitivityWarnings] = useState(true);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-md border border-zinc-700">
        <div className="flex items-center gap-1.5">
          {isEnabled ? (
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
          ) : (
            <Bot className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <span className={`text-xs font-medium ${isEnabled ? 'text-yellow-400' : 'text-zinc-400'}`}>
            Agent Mode
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Switch
            checked={isEnabled}
            onCheckedChange={onToggle}
            className="scale-75"
          />
          
          {isEnabled && (
            <>
              {isRunning ? (
                <Button variant="ghost" size="sm" onClick={onPause} className="h-6 w-6 p-0">
                  <Pause className="w-3 h-3" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={onResume} className="h-6 w-6 p-0">
                  <Play className="w-3 h-3" />
                </Button>
              )}
              
              <Button variant="ghost" size="sm" onClick={onStop} className="h-6 w-6 p-0">
                <Square className="w-3 h-3" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowSettings(!showSettings)}
                className="h-6 w-6 p-0"
              >
                <Settings className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
      </div>

      {isEnabled && showSettings && (
        <div className="space-y-2">
          <NaturalLanguageDetection
            isEnabled={nlDetectionEnabled}
            onToggle={setNlDetectionEnabled}
            denylist={denylist}
            onDenylistUpdate={setDenylist}
          />
          
          <TransparencyControls
            showDataTransmission={showDataTransmission}
            onShowDataTransmissionToggle={setShowDataTransmission}
            requireApproval={requireApproval}
            onRequireApprovalToggle={setRequireApproval}
            showSensitivityWarnings={showSensitivityWarnings}
            onShowSensitivityWarningsToggle={setShowSensitivityWarnings}
          />
        </div>
      )}
    </div>
  );
};
