import React, { useState } from 'react';

// Dummy workflow data for demo; replace with real data loading
const workflows = [
  { name: 'Build Project', params: ['target', 'release'], steps: ['npm install', 'npm run build'], yaml: `name: Build Project\nparams:\n  - target\n  - release\nsteps:\n  - npm install\n  - npm run build\n` },
  { name: 'Deploy', params: ['env'], steps: ['npm run deploy'], yaml: `name: Deploy\nparams:\n  - env\nsteps:\n  - npm run deploy\n` },
];

export default function WorkflowRunner() {
  const [selected, setSelected] = useState<any>(null);
  const [inputs, setInputs] = useState<any>({});
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    setLoading(true);
    setError(null);
    setOutput('');
    try {
      // Call local API endpoint to run workflow via Rust CLI
      const res = await fetch('/api/run-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selected.name,
          yaml: selected.yaml,
          params: inputs,
        }),
      });
      if (!res.ok) throw new Error('Failed to run workflow');
      const data = await res.json();
      setOutput(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="font-bold mb-2">Run a Workflow</h2>
      <select
        className="select select-bordered mb-4"
        onChange={e => {
          const wf = workflows.find(w => w.name === e.target.value);
          setSelected(wf);
          setInputs({});
          setOutput('');
        }}
        defaultValue=""
      >
        <option value="" disabled>Select workflow...</option>
        {workflows.map(wf => (
          <option key={wf.name} value={wf.name}>{wf.name}</option>
        ))}
      </select>
      {selected && (
        <div className="mb-4">
          <h3 className="font-semibold">Parameters</h3>
          {selected.params.map((param: string) => (
            <div key={param} className="mb-2">
              <label className="mr-2">{param}:</label>
              <input
                className="input input-bordered"
                value={inputs[param] || ''}
                onChange={e => setInputs({ ...inputs, [param]: e.target.value })}
              />
            </div>
          ))}
          <button className="btn btn-primary mt-2" onClick={handleRun}>Run</button>
        </div>
      )}
      {loading && (
        <div className="text-center text-gray-400">Running workflow...</div>
      )}
      {error && (
        <div className="alert alert-error mt-4">{error}</div>
      )}
      {output && (
        <pre className="alert alert-info mt-4 whitespace-pre-wrap text-left">{output}</pre>
      )}
    </div>
  );
}
