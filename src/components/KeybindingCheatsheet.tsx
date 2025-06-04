import React, { useEffect, useState } from 'react';

export default function KeybindingCheatsheet() {
  const [bindings, setBindings] = useState<any[]>([]);

  useEffect(() => {
    fetch('/keysets/default-warp-keybindings.yaml')
      .then(r => r.text())
      .then(txt => {
        // Very basic YAML parsing for demo
        const lines = txt.split('\n').filter(l => l.includes('key:'));
        setBindings(lines.map(l => l.replace('key:', '').trim()));
      });
  }, []);

  return (
    <div>
      <h2 className="font-bold mb-2">Keyboard Shortcut Cheatsheet</h2>
      <ul>
        {bindings.map((b, i) => (
          <li key={i} className="font-mono">{b}</li>
        ))}
      </ul>
    </div>
  );
}
