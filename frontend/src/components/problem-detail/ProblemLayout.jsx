import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Split from 'react-split';

/**
 * ProblemLayout - Split-pane layout for problem detail page
 * 
 * Features:
 * - Resizable panes with React Split
 * - localStorage persistence for split position
 * - Responsive design (stacks vertically on mobile)
 * - New color scheme: background (#22223b), primary (#c9ada7), text (#f2e9e4)
 */
function ProblemLayout({ leftPane, rightPane, problemId }) {
  const [isMobile, setIsMobile] = useState(false);
  const [sizes, setSizes] = useState([50, 50]);

  // Load saved split position from localStorage
  useEffect(() => {
    const savedSizes = localStorage.getItem(`split-sizes-${problemId}`);
    if (savedSizes) {
      try {
        const parsed = JSON.parse(savedSizes);
        setSizes(parsed);
      } catch (e) {
        console.error('Failed to parse saved split sizes:', e);
      }
    }
  }, [problemId]);

  // Save split position to localStorage
  const handleDragEnd = (newSizes) => {
    setSizes(newSizes);
    localStorage.setItem(`split-sizes-${problemId}`, JSON.stringify(newSizes));
  };

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile layout - stack vertically
  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Left pane - problem description */}
        <div className="flex-1 overflow-auto border-b border-slate-700">
          {leftPane}
        </div>
        
        {/* Right pane - code editor */}
        <div className="flex-1 overflow-auto">
          {rightPane}
        </div>
      </div>
    );
  }

  // Desktop layout - split horizontally
  return (
    <Split
      sizes={sizes}
      minSize={300}
      expandToMin={false}
      gutterSize={8}
      gutterAlign="center"
      snapOffset={30}
      dragInterval={1}
      direction="horizontal"
      cursor="col-resize"
      className="flex h-full bg-background"
      onDragEnd={handleDragEnd}
      gutter={(index, direction) => {
        const gutter = document.createElement('div');
        gutter.className = `gutter gutter-${direction} bg-slate-700 hover:bg-primary transition-colors cursor-col-resize`;
        return gutter;
      }}
    >
      {/* Left pane - problem description */}
      <div className="overflow-auto bg-background">
        {leftPane}
      </div>

      {/* Right pane - code editor */}
      <div className="overflow-auto bg-slate-850">
        {rightPane}
      </div>
    </Split>
  );
}

ProblemLayout.propTypes = {
  leftPane: PropTypes.node.isRequired,
  rightPane: PropTypes.node.isRequired,
  problemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ProblemLayout;
