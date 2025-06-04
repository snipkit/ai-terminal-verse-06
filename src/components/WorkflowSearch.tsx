import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { fuzzySearch } from '../utils/fuzzySearch';

export default function WorkflowSearch() {
  const [query, setQuery] = useState('');
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [sort, setSort] = useState('name');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    setLoading(true);
    fetch('/static/previews/workflows/index.json')
      .then(r => r.json())
      .then(data => {
        setWorkflows(data);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load workflows');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let res = fuzzySearch(workflows, query);
    if (category !== 'all') res = res.filter(wf => wf.category === category);
    if (sort === 'name') res = res.sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(res);
  }, [query, workflows, sort, category]);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(workflows.map(w => w.category).filter(Boolean)))];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search workflows..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="input input-bordered flex-1"
        />
        <select value={category} onChange={e => setCategory(e.target.value)} className="select select-bordered">
          {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="select select-bordered">
          <option value="name">Sort: Name</option>
        </select>
      </div>
      {loading && <div className="text-center text-gray-400">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && filtered.length === 0 && <div className="text-center text-gray-400">No results found</div>}
      <ul>
        {filtered.map(wf => (
          <li key={wf.name} className="mb-2">
            <button className="font-bold text-blue-600 hover:underline" onClick={() => setSelected(wf)}>{wf.name}</button>
            <p className="text-sm text-gray-500">{wf.description}</p>
          </li>
        ))}
      </ul>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div>
            <p className="mb-2">{selected.description}</p>
            <h4 className="font-semibold mb-1">Preview:</h4>
            <iframe
              src={`/static/previews/workflows/${selected.file}`}
              title="Workflow Preview"
              className="w-full h-48 border rounded mb-2"
            />
            <a
              href={`/static/previews/workflows/${selected.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >Open Markdown</a>
          </div>
        )}
      </Modal>
    </div>
  );
}
