
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Brain, Shield, Plus, X } from 'lucide-react';

interface NaturalLanguageDetectionProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  denylist: string[];
  onDenylistUpdate: (denylist: string[]) => void;
}

export const NaturalLanguageDetection: React.FC<NaturalLanguageDetectionProps> = ({
  isEnabled,
  onToggle,
  denylist,
  onDenylistUpdate
}) => {
  const [newDenyItem, setNewDenyItem] = useState('');

  const addToDenylist = () => {
    if (newDenyItem.trim() && !denylist.includes(newDenyItem.trim())) {
      onDenylistUpdate([...denylist, newDenyItem.trim()]);
      setNewDenyItem('');
    }
  };

  const removeFromDenylist = (item: string) => {
    onDenylistUpdate(denylist.filter(i => i !== item));
  };

  return (
    <Card className="p-4 bg-zinc-900 border-zinc-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-zinc-200">Natural Language Detection</span>
          </div>
          <Switch checked={isEnabled} onCheckedChange={onToggle} />
        </div>

        {isEnabled && (
          <div className="space-y-3">
            <div className="text-xs text-zinc-400">
              Commands matching patterns in the denylist will not be processed as natural language.
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newDenyItem}
                onChange={(e) => setNewDenyItem(e.target.value)}
                placeholder="Add keyword or pattern..."
                className="text-xs bg-zinc-800 border-zinc-700"
                onKeyDown={(e) => e.key === 'Enter' && addToDenylist()}
              />
              <Button size="sm" onClick={addToDenylist} className="px-2">
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {denylist.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-zinc-500">Denylist:</div>
                <div className="flex flex-wrap gap-1">
                  {denylist.map((item) => (
                    <div key={item} className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded text-xs">
                      <Shield className="w-3 h-3 text-red-400" />
                      <span className="text-zinc-300">{item}</span>
                      <button onClick={() => removeFromDenylist(item)} className="text-zinc-500 hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
