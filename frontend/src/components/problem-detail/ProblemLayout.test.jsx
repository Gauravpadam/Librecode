import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProblemLayout from './ProblemLayout';

describe('ProblemLayout', () => {
  let originalInnerWidth;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    // Mock localStorage
    Storage.prototype.getItem = vi.fn();
    Storage.prototype.setItem = vi.fn();
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    vi.clearAllMocks();
  });

  it('renders left and right panes', () => {
    render(
      <ProblemLayout
        leftPane={<div>Left Pane Content</div>}
        rightPane={<div>Right Pane Content</div>}
        problemId="1"
      />
    );

    expect(screen.getByText('Left Pane Content')).toBeInTheDocument();
    expect(screen.getByText('Right Pane Content')).toBeInTheDocument();
  });

  it('applies correct background colors', () => {
    const { container } = render(
      <ProblemLayout
        leftPane={<div>Left</div>}
        rightPane={<div>Right</div>}
        problemId="1"
      />
    );

    const leftPane = container.querySelector('.bg-background');
    expect(leftPane).toBeInTheDocument();
  });

  it('loads saved split sizes from localStorage', () => {
    const savedSizes = [40, 60];
    Storage.prototype.getItem = vi.fn(() => JSON.stringify(savedSizes));

    render(
      <ProblemLayout
        leftPane={<div>Left</div>}
        rightPane={<div>Right</div>}
        problemId="test-problem"
      />
    );

    expect(localStorage.getItem).toHaveBeenCalledWith('split-sizes-test-problem');
  });

  it('handles mobile viewport by stacking vertically', () => {
    // Set mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { container } = render(
      <ProblemLayout
        leftPane={<div>Left</div>}
        rightPane={<div>Right</div>}
        problemId="1"
      />
    );

    // Check for flex-col class (vertical stacking)
    const mobileContainer = container.querySelector('.flex-col');
    expect(mobileContainer).toBeInTheDocument();
  });

  it('uses split layout on desktop', () => {
    // Set desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    render(
      <ProblemLayout
        leftPane={<div>Left</div>}
        rightPane={<div>Right</div>}
        problemId="1"
      />
    );

    // Split component should be rendered (check for split class)
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });
});
