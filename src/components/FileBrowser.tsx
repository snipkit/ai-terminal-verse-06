import React, { useState, useEffect } from 'react';

interface FileBrowserProps {
  currentPath: string;
  setCurrentPath: (path: string) => void;
  setSelectedFile: (file: string | null) => void;
}

interface FileEntry {
  name: string;
  type: 'file' | 'dir';
}

export const FileBrowser: React.FC<FileBrowserProps> = ({
  currentPath,
  setCurrentPath,
  setSelectedFile,
}) => {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        // Call the list_dir tool
        // @ts-ignore: default_api is provided by the environment
        const response = await default_api.list_dir({ relative_workspace_path: currentPath });
        // Assuming the response has a 'result' field with the directory contents
        if (response.result && response.result.contents) {
          const parsedEntries = response.result.contents.map((item: any) => ({
            name: item.name,
            type: item.type,
          }));
          setEntries(parsedEntries);
        } else {
             // Handle the case where the tool call failed but returned no error
             setEntries([]);
        }

      } catch (err: any) {
        setError(err.message);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [currentPath]);

  const handleEntryClick = (entry: FileEntry) => {
    if (entry.type === 'dir') {
      setCurrentPath(`${currentPath}/${entry.name}`);
    } else {
      setSelectedFile(`${currentPath}/${entry.name}`);
    }
  };

  const handleBackClick = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '.';
    setCurrentPath(parentPath);
  };

  return (
    <div className="p-4 text-zinc-100">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={handleBackClick} disabled={currentPath === '.'} className="px-2 py-1 bg-zinc-700 rounded disabled:opacity-50">
          Back
        </button>
        <span>Current Path: {currentPath}</span>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {!loading && !error && (entries.length === 0 ? (
        <div>Directory is empty.</div>
      ) : (
        <ul>
          {entries.map((entry, index) => (
            <li key={index} onClick={() => handleEntryClick(entry)} className="cursor-pointer hover:bg-zinc-700 p-1 rounded">
              {entry.type === 'dir' ? `📁 ${entry.name}/` : `📄 ${entry.name}`}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}; 