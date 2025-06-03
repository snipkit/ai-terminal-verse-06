import React, { useState, useEffect, useRef } from 'react';

export interface CommandPaletteAction {
  label: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  actions: CommandPaletteAction[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose, actions }) => {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(actions);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      lastActiveElement.current = document.activeElement as HTMLElement;
      setQuery('');
      setSelected(0);
      setFiltered(actions);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (lastActiveElement.current) {
      lastActiveElement.current.focus();
    }
  }, [open, actions]);

  useEffect(() => {
    setFiltered(
      actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()))
    );
    setSelected(0);
  }, [query, actions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      setSelected(s => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && filtered[selected]) {
      filtered[selected].onSelect();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl w-full max-w-md mx-auto p-4 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="w-full p-2 rounded bg-zinc-800 text-zinc-100 border border-zinc-700 mb-3 focus:outline-none font-mono"
          placeholder="Type a command..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Command Palette Search"
        />
        <div className="max-h-60 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="text-zinc-500 text-sm py-2 text-center">No actions found</div>
          )}
          {filtered.map((action, i) => (
            <div
              key={action.label}
              className={`px-3 py-2 rounded cursor-pointer text-zinc-100 text-sm font-mono transition-colors ${
                i === selected ? 'bg-blue-600/30' : 'hover:bg-zinc-700'
              }`}
              onMouseEnter={() => setSelected(i)}
              onClick={() => { action.onSelect(); onClose(); }}
            >
              {action.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 