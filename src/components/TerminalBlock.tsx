import React from 'react';

interface TerminalBlockProps {
  id: string;
  command: string;
  output: string;
  status: 'success' | 'error' | 'running';
  timestamp: string;
  onCopy: (output: string) => void;
  onRerun: (command: string) => void;
  onDelete: (id: string) => void;
  onShare?: (output: string) => void;
}

export const TerminalBlock: React.FC<TerminalBlockProps> = ({
  id,
  command,
  output,
  status,
  timestamp,
  onCopy,
  onRerun,
  onDelete,
  onShare,
}) => {
  return (
    <div className={`rounded-lg border bg-zinc-900 p-4 shadow transition hover:bg-zinc-800 relative group`}>  
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs text-zinc-400">{timestamp}</span>
        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${status === 'success' ? 'bg-green-700 text-green-100' : status === 'error' ? 'bg-red-700 text-red-100' : 'bg-yellow-700 text-yellow-100'}`}>{status}</span>
      </div>
      <div className="font-mono text-zinc-200 whitespace-pre-wrap mb-2">
        <span className="text-blue-400">$ </span>{command}
      </div>
      <div className="font-mono text-zinc-100 whitespace-pre-wrap mb-2 border-l-2 border-zinc-700 pl-3">
        {output}
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
        <button
          title="Copy Output"
          onClick={() => onCopy(output)}
          className="p-1 rounded hover:bg-zinc-700"
        >
          <span role="img" aria-label="Copy">📋</span>
        </button>
        <button
          title="Rerun Command"
          onClick={() => onRerun(command)}
          className="p-1 rounded hover:bg-zinc-700"
        >
          <span role="img" aria-label="Rerun">🔄</span>
        </button>
        <button
          title="Delete Block"
          onClick={() => onDelete(id)}
          className="p-1 rounded hover:bg-zinc-700"
        >
          <span role="img" aria-label="Delete">🗑️</span>
        </button>
        {onShare && (
          <button
            title="Share Output"
            onClick={() => onShare(output)}
            className="p-1 rounded hover:bg-zinc-700"
          >
            <span role="img" aria-label="Share">🔗</span>
          </button>
        )}
      </div>
    </div>
  );
};
