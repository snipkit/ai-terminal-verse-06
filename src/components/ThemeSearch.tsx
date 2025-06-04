import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { fuzzySearch } from '../utils/fuzzySearch';

export default function ThemeSearch() {
  const [query, setQuery] = useState('');
  const [themes, setThemes] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [sort, setSort] = useState('name');

  useEffect(() => {
    setLoading(true);
    fetch('/static/previews/themes/index.json')
      .then(r => r.json())
      .then(data => {
        setThemes(data);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load themes');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let res = fuzzySearch(themes, query);
    if (sort === 'name') res = res.sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(res);
  }, [query, themes, sort]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search themes..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="input input-bordered flex-1"
        />
        <select value={sort} onChange={e => setSort(e.target.value)} className="select select-bordered">
          <option value="name">Sort: Name</option>
        </select>
      </div>
      {loading && <div className="text-center text-gray-400">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && filtered.length === 0 && <div className="text-center text-gray-400">No results found</div>}
      <ul>
        {filtered.map(theme => (
          <li key={theme.name} className="mb-2">
            <button className="font-bold text-blue-600 hover:underline" onClick={() => setSelected(theme)}>{theme.name}</button>
            <img src={`/static/previews/themes/${theme.file}`} alt={theme.name} className="w-48 h-8 cursor-pointer" onClick={() => setSelected(theme)} />
          </li>
        ))}
      </ul>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div>
            <h4 className="font-semibold mb-2">Color Palette Preview:</h4>
            <img
              src={`/static/previews/themes/${selected.file}`}
              alt={selected.name}
              className="w-full h-12 border rounded mb-2"
            />
            <a
              href={`/static/previews/themes/${selected.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >Open SVG</a>
          </div>
        )}
      </Modal>
    </div>
  );
}
