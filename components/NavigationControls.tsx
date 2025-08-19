import React from 'react';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';

interface NavigationControlsProps {
  onMove: (direction: 'Up' | 'Down' | 'Left' | 'Right') => void;
  disabled: boolean;
}

const NavButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode, 'aria-label': string, className?: string }> = 
({ onClick, disabled, children, 'aria-label': ariaLabel, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={`themed-bg-secondary/70 backdrop-blur-sm rounded-lg shadow-lg border border-[rgb(var(--text-primary)/0.1)] p-4 transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-100 disabled:opacity-50 disabled:transform-none ${className}`}
  >
    {children}
  </button>
);

const NavigationControls: React.FC<NavigationControlsProps> = ({ onMove, disabled }) => {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2 w-48 mt-4">
      <div className="col-start-2 row-start-1">
        <NavButton onClick={() => onMove('Up')} disabled={disabled} aria-label="Move Up">
          <ArrowUpIcon className="w-8 h-8 themed-text-primary" />
        </NavButton>
      </div>
      <div className="col-start-1 row-start-2">
        <NavButton onClick={() => onMove('Left')} disabled={disabled} aria-label="Move Left">
          <ArrowLeftIcon className="w-8 h-8 themed-text-primary" />
        </NavButton>
      </div>
      <div className="col-start-3 row-start-2">
        <NavButton onClick={() => onMove('Right')} disabled={disabled} aria-label="Move Right">
          <ArrowRightIcon className="w-8 h-8 themed-text-primary" />
        </NavButton>
      </div>
      <div className="col-start-2 row-start-3">
        <NavButton onClick={() => onMove('Down')} disabled={disabled} aria-label="Move Down">
          <ArrowDownIcon className="w-8 h-8 themed-text-primary" />
        </NavButton>
      </div>
    </div>
  );
};

export default NavigationControls;
