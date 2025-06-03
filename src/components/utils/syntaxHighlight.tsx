import React from 'react';

export function getSyntaxHighlightedText(text: string): React.ReactNode {
  // Simple syntax highlighting simulation
  const parts = text.split(' ');
  return parts.map((part, index) => {
    if (part.startsWith('--')) {
      return <span key={index} className="text-yellow-400">{part} </span>;
    } else if (part.includes('|') || part.includes('>')) {
      return <span key={index} className="text-green-400">{part} </span>;
    } else if (index === 0) {
      return <span key={index} className="text-blue-400">{part} </span>;
    }
    return <span key={index} className="text-zinc-100">{part} </span>;
  });
} 