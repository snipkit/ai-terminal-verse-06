
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';

interface TransparencyControlsProps {
  showDataTransmission: boolean;
  onShowDataTransmissionToggle: (enabled: boolean) => void;
  requireApproval: boolean;
  onRequireApprovalToggle: (enabled: boolean) => void;
  showSensitivityWarnings: boolean;
  onShowSensitivityWarningsToggle: (enabled: boolean) => void;
}

export const TransparencyControls: React.FC<TransparencyControlsProps> = ({
  showDataTransmission,
  onShowDataTransmissionToggle,
  requireApproval,
  onRequireApprovalToggle,
  showSensitivityWarnings,
  onShowSensitivityWarningsToggle
}) => {
  return (
    <Card className="p-4 bg-zinc-900 border-zinc-800">
      <div className="space-y-4">
        <div className="text-sm font-medium text-zinc-200 mb-3">Transparency & Control</div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-xs text-zinc-200">Show Data Transmission</div>
                <div className="text-xs text-zinc-500">Display when data is sent to AI</div>
              </div>
            </div>
            <Switch checked={showDataTransmission} onCheckedChange={onShowDataTransmissionToggle} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs text-zinc-200">Require Command Approval</div>
                <div className="text-xs text-zinc-500">Always ask before executing commands</div>
              </div>
            </div>
            <Switch checked={requireApproval} onCheckedChange={onRequireApprovalToggle} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <div>
                <div className="text-xs text-zinc-200">Sensitivity Warnings</div>
                <div className="text-xs text-zinc-500">Warn about potentially unsafe operations</div>
              </div>
            </div>
            <Switch checked={showSensitivityWarnings} onCheckedChange={onShowSensitivityWarningsToggle} />
          </div>
        </div>
      </div>
    </Card>
  );
};
