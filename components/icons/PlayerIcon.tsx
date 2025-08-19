import React from 'react';

const PlayerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-label="Player"
    role="img"
  >
    <path d="M12 2a5 5 0 1 0 5 5a5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3a3 3 0 0 1-3 3zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm0 2c1.47 0 4.17.61 5.86 1.34l-11.72.01C7.83 14.61 10.53 14 12 14z" />
  </svg>
);

export default PlayerIcon;
