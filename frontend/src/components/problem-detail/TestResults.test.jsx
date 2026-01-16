import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestResults from './TestResults';

describe('TestResults', () => {
  it('shows loading state when isLoading is true', () => {
    render(<TestResults isLoading={true} />);
    expect(screen.getByText(/running tests/i)).toBeInTheDocument();
  });

  it('shows empty state when no results', () => {
    render(<TestResults results={[]} />);
    expect(screen.getByText(/no test results yet/i)).toBeInTheDocument();
  });

  it('displays test results summary', () => {
    const results = [
      { passed: true, input: '1', expected: '2', actual: '2' },
      { passed: false, input: '2', expected: '4', actual: '3' },
    ];
    render(<TestResults results={results} />);
    
    expect(screen.getByText(/test results/i)).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 2 passed/i)).toBeInTheDocument();
  });

  it('shows all passed status when all tests pass', () => {
    const results = [
      { passed: true, input: '1', expected: '2', actual: '2' },
      { passed: true, input: '2', expected: '4', actual: '4' },
    ];
    render(<TestResults results={results} />);
    
    expect(screen.getByText(/2 \/ 2 passed/i)).toBeInTheDocument();
  });

  it('displays individual test case details', () => {
    const results = [
      { 
        passed: true, 
        input: 'test input', 
        expected: 'expected output', 
        actual: 'expected output' 
      },
    ];
    render(<TestResults results={results} />);
    
    expect(screen.getByText(/test case 1/i)).toBeInTheDocument();
    expect(screen.getByText('PASSED')).toBeInTheDocument();
    expect(screen.getByText('test input')).toBeInTheDocument();
    expect(screen.getAllByText('expected output')).toHaveLength(2); // Expected and Actual
  });

  it('displays error message for failed tests', () => {
    const results = [
      { 
        passed: false, 
        input: '1', 
        expected: '2', 
        actual: '3',
        error: 'Assertion failed: expected 2 but got 3'
      },
    ];
    render(<TestResults results={results} />);
    
    expect(screen.getByText('FAILED')).toBeInTheDocument();
    expect(screen.getByText(/assertion failed/i)).toBeInTheDocument();
  });

  it('displays runtime and memory information', () => {
    const results = [
      { 
        passed: true, 
        input: '1', 
        expected: '2', 
        actual: '2',
        runtime: 15,
        memory: 2.5
      },
    ];
    render(<TestResults results={results} />);
    
    expect(screen.getByText(/runtime: 15ms/i)).toBeInTheDocument();
    expect(screen.getByText(/memory: 2.5mb/i)).toBeInTheDocument();
  });

  it('handles JSON input and output', () => {
    const results = [
      { 
        passed: true, 
        input: { nums: [1, 2, 3] }, 
        expected: { sum: 6 }, 
        actual: { sum: 6 }
      },
    ];
    render(<TestResults results={results} />);
    
    expect(screen.getByText(/"nums":\[1,2,3\]/)).toBeInTheDocument();
    expect(screen.getAllByText(/"sum":6/)).toHaveLength(2); // Expected and Actual
  });

  it('applies custom className', () => {
    const { container } = render(<TestResults results={[]} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('shows correct pass/fail icons', () => {
    const results = [
      { passed: true, input: '1', expected: '2', actual: '2' },
      { passed: false, input: '2', expected: '4', actual: '3' },
    ];
    const { container } = render(<TestResults results={results} />);
    
    // Check for SVG icons (checkmark and X)
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(2);
  });
});
