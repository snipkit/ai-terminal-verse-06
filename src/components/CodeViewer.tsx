import React, { useState, useEffect } from 'react';

interface CodeViewerProps {
  filePath: string;
  setSelectedFile: (file: string | null) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  filePath,
  setSelectedFile,
}) => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileContent = async () => {
      setLoading(true);
      setError(null);
      setFileContent(null);
      try {
        // Call the read_file tool
        // @ts-ignore: default_api is provided by the environment
        const response = await default_api.read_file({
          target_file: filePath,
          should_read_entire_file: true, // Assuming we want the whole file for viewing
          start_line_one_indexed: 1,
          end_line_one_indexed_inclusive: 250 // Max lines for the tool call
        });

        // Assuming the response has a 'result' field with the file contents
        if (response.result && response.result.contents) {
          setFileContent(response.result.contents);
        } else {
          // Handle cases where the file might be empty or tool returned no content
          setFileContent('File is empty or could not be read.');
        }

      } catch (err: any) {
        setError(err.message);
        setFileContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFileContent();
  }, [filePath]);

  return (
    <div className="p-4 text-zinc-100">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setSelectedFile(null)} className="px-2 py-1 bg-zinc-700 rounded">
          Back to File Browser
        </button>
        <span>Viewing File: {filePath}</span>
      </div>
      {loading && <div>Loading file...</div>}
      {error && <div className="text-red-500">Error loading file: {error}</div>}
      {fileContent !== null && !loading && !error && (
        <pre className="bg-zinc-900 p-4 rounded-md overflow-auto text-sm">
          <code>{fileContent}</code>
        </pre>
      )}
    </div>
  );
}; 