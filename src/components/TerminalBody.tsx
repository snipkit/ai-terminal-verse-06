import React from 'react';

interface TerminalBodyProps {
  children: React.ReactNode;
  isFileBrowsing: boolean;
  currentPath: string;
  selectedFile: string | null;
  setIsFileBrowsing: (isBrowsing: boolean) => void;
  setCurrentPath: (path: string) => void;
  setSelectedFile: (file: string | null) => void;
}

export const TerminalBody: React.FC<TerminalBodyProps> = ({
  children,
  isFileBrowsing,
  currentPath,
  selectedFile,
  setIsFileBrowsing,
  setCurrentPath,
  setSelectedFile,
}) => {
  return (
    <div className="bg-black border border-zinc-800 border-t-0 rounded-b-xl">
      {isFileBrowsing ? (
        selectedFile ? (
          // Placeholder for CodeViewer component
          <div>Viewing file: {selectedFile}</div>
        ) : (
          // Placeholder for FileBrowser component
          <div>Browsing directory: {currentPath}</div>
        )
      ) : (
        children
      )}
    </div>
  );
};
