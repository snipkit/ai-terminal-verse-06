import React, { useState } from 'react';

const themes = [
  'default', 'dark', 'light', 'solarized', 'dracula'
];

export default function ThemeSwitcher() {
  const [current, setCurrent] = useState('default');
  return (
    <div>
      <h2 className="font-bold mb-2">Theme Switcher</h2>
      <select
        className="select select-bordered"
        value={current}
        onChange={e => setCurrent(e.target.value)}
      >
        {themes.map(name => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
      <div className="mt-2">Current theme: <span className="font-mono">{current}</span></div>
    </div>
  );
}
