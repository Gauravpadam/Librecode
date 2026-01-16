import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProblemDetail from './ProblemDetail';

// Mock the API module
vi.mock('../contexts/AuthContext', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  ),
}));

// Mock react-split
vi.mock('react-split', () => ({
  default: ({ children }) => <div data-testid="split-layout">{children}</div>,
}));

// Mock components
vi.mock('../components/problem-detail/ProblemLayout', () => ({
  default: ({ leftPane, rightPane }) => (
    <div data-testid="problem-layout">
      <div data-testid="left-pane">{leftPane}</div>
      <div data-testid="right-pane">{rightPane}</div>
    </div>
  ),
}));

vi.mock('../components/problem-detail/SolutionsTab', () => ({
  default: ({ problemId }) => <div data-testid="solutions-tab">Solutions for problem {problemId}</div>,
}));

import { api } from '../contexts/AuthContext';

// Mock problem data
const mockProblem = {
  id: 1,
  title: 'Two Sum',
  description: 'Given an array of integers, return indices of the two numbers that add up to a target.',
  difficulty: 'Easy',
  constraints: '2 <= nums.length <= 10^4',
  timeLimitMs: 1000,
  memoryLimitMb: 256,
  starterCodeJava: 'class Solution {\n  // Write your code here\n}',
  starterCodePython: '# Write your code here',
  starterCodeJavascript: '// Write your code here',
  tags: ['Array', 'Hash Table'],
};

const mockTestCases = [
  {
    id: 1,
    input: '[2,7,11,15], 9',
    expectedOutput: '[0,1]',
    isSample: true,
  },
];

describe('ProblemDetail Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Setup default API responses
    api.get.mockImplementation((url) => {
      if (url.includes('/problems/1')) {
        return Promise.resolve({ data: mockProblem });
      }
      if (url.includes('/testcases')) {
        return Promise.resolve({ data: mockTestCases });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('should render the integrated page with all components', async () => {
    render(
      <MemoryRouter initialEntries={['/problems/1']}>
        <ProblemDetail />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
    });
    
    // Check that ProblemLayout is rendered
    expect(screen.getByTestId('problem-layout')).toBeInTheDocument();
    
    // Check that left and right panes exist
    expect(screen.getByTestId('left-pane')).toBeInTheDocument();
    expect(screen.getByTestId('right-pane')).toBeInTheDocument();
  });

  it('should display problem details in the description tab', async () => {
    render(
      <MemoryRouter initialEntries={['/problems/1']}>
        <ProblemDetail />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Given an array of integers/i)).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('should have language selector and action buttons', async () => {
    render(
      <MemoryRouter initialEntries={['/problems/1']}>
        <ProblemDetail />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
    });
    
    expect(screen.getByLabelText(/Select programming language/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Run/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('should have tab navigation buttons', async () => {
    render(
      <MemoryRouter initialEntries={['/problems/1']}>
        <ProblemDetail />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
    });
    
    expect(screen.getByRole('button', { name: /Description/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Solutions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submissions/i })).toBeInTheDocument();
  });

  it('should render CodeEditor component', async () => {
    render(
      <MemoryRouter initialEntries={['/problems/1']}>
        <ProblemDetail />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
    });
    
    // Monaco editor is mocked as a textarea
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
  });

  it('should handle tab routing via URL query parameters', async () => {
    render(
      <MemoryRouter initialEntries={['/problems/1?tab=solutions']}>
        <ProblemDetail />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
    });
    
    // Solutions tab should be rendered
    await waitFor(() => {
      expect(screen.getByTestId('solutions-tab')).toBeInTheDocument();
    });
  });

  it('should apply new color scheme classes', async () => {
    render(
      <MemoryRouter initialEntries={['/problems/1']}>
        <ProblemDetail />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
    });
    
    const header = screen.getByText('Two Sum').closest('div');
    expect(header).toHaveClass('bg-slate-850');
  });
});
