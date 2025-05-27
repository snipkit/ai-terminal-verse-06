import React from 'react';

interface ErrorProps {
  error: string;
}

const WarpError = ({ error }: ErrorProps) => (
  <div className="text-white font-main">{error}</div>
);

export default WarpError;
