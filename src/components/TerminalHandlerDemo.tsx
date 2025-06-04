
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { unifiedHandler, highlightKeywords } from '@/utils/terminalHandler';

export const TerminalHandlerDemo: React.FC = () => {
  const [testInput, setTestInput] = useState('');
  const [result, setResult] = useState<any>(null);

  const testCases = [
    "open AI terminal",
    "deploy to production", 
    "show me running containers",
    "edit: list active processes -> list all processes",
    "clear terminal",
    "dep", // partial input for suggestions
    "check sys" // partial input for suggestions
  ];

  const handleTest = (input: string) => {
    const response = unifiedHandler(input);
    setResult({ input, response });
  };

  const handleCustomTest = () => {
    if (testInput.trim()) {
      handleTest(testInput);
    }
  };

  return (
    <Card className="p-6 max-w-2xl">
      <h3 className="text-lg font-semibold mb-4">Terminal Handler Demo</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Test Cases:</h4>
          <div className="grid gap-2">
            {testCases.map((testCase, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleTest(testCase)}
                className="justify-start text-left"
              >
                {testCase}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Custom Test:</h4>
          <div className="flex gap-2">
            <Input
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Enter custom command..."
              onKeyDown={(e) => e.key === 'Enter' && handleCustomTest()}
            />
            <Button onClick={handleCustomTest}>Test</Button>
          </div>
        </div>

        {result && (
          <div className="mt-4 p-4 bg-zinc-900 rounded-lg">
            <div className="text-sm">
              <div className="text-zinc-400">Input: <span className="text-zinc-200">{result.input}</span></div>
              <div className="text-zinc-400 mt-2">Output:</div>
              <div className="text-zinc-200 mt-1">
                {result.response.type === 'suggestion' ? (
                  <div className="space-y-1">
                    {(result.response.content as any[]).map((suggestion, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-mono">{highlightKeywords(suggestion.command)}</span>
                        <span className="text-zinc-400 ml-2">- {suggestion.description}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="font-mono">{result.response.content}</span>
                )}
              </div>
              <div className="text-zinc-500 text-xs mt-2">Type: {result.response.type}</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
