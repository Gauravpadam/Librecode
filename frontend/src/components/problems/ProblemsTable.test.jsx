import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ProblemsTable from './ProblemsTable';

// Mock ProblemRow to simplify testing
vi.mock('./ProblemRow', () => ({
  default: ({ problem }) => (
    <tr data-testid={`problem-row-${problem.id}`}>
      <td>{problem.title}</td>
    </tr>
  ),
}));

describe('ProblemsTable', () => {
  const mockProblems = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      userStatus: 'solved',
      tags: ['Array', 'Hash Table'],
    },
    {
      id: 2,
      title: 'Add Two Numbers',
      difficulty: 'Medium',
      userStatus: 'attempted',
      tags: ['Linked List'],
    },
    {
      id: 3,
      title: 'Median of Two Sorted Arrays',
      difficulty: 'Hard',
      userStatus: 'not_attempted',
      tags: ['Array', 'Binary Search'],
    },
  ];

  const defaultProps = {
    problems: mockProblems,
    sortBy: null,
    onSortChange: vi.fn(),
  };

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders table with column headers', () => {
      renderWithRouter(<ProblemsTable {...defaultProps} />);
      
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Difficulty')).toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
    });

    it('renders all problems', () => {
      renderWithRouter(<ProblemsTable {...defaultProps} />);
      
      expect(screen.getByTestId('problem-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('problem-row-2')).toBeInTheDocument();
      expect(screen.getByTestId('problem-row-3')).toBeInTheDocument();
    });

    it('displays problem count', () => {
      renderWithRouter(<ProblemsTable {...defaultProps} />);
      
      expect(screen.getByText('Showing 3 problems')).toBeInTheDocument();
    });

    it('displays singular "problem" for single result', () => {
      renderWithRouter(
        <ProblemsTable {...defaultProps} problems={[mockProblems[0]]} />
      );
      
      expect(screen.getByText('Showing 1 problem')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading message when loading', () => {
      renderWithRouter(<ProblemsTable {...defaultProps} loading={true} />);
      
      expect(screen.getByText('Loading problems...')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty message when no problems', () => {
      renderWithRouter(<ProblemsTable {...defaultProps} problems={[]} />);
      
      expect(screen.getByText('No problems found matching your filters.')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('marks sortable columns with buttons', () => {
      renderWithRouter(<ProblemsTable {...defaultProps} />);
      
      const titleButton = screen.getByRole('button', { name: /Sort by Title/ });
      const difficultyButton = screen.getByRole('button', { name: /Sort by Difficulty/ });
      
      expect(titleButton).toBeInTheDocument();
      expect(difficultyButton).toBeInTheDocument();
    });

    it('does not make Status and Tags columns sortable', () => {
      renderWithRouter(<ProblemsTable {...defaultProps} />);
      
      const statusHeader = screen.getByText('Status');
      const tagsHeader = screen.getByText('Tags');
      
      // These should be spans, not buttons
      expect(statusHeader.tagName).toBe('SPAN');
      expect(tagsHeader.tagName).toBe('SPAN');
    });

    it('calls onSortChange when sortable column clicked', () => {
      const mockOnSortChange = vi.fn();
      renderWithRouter(
        <ProblemsTable {...defaultProps} onSortChange={mockOnSortChange} />
      );
      
      const titleButton = screen.getByRole('button', { name: /Sort by Title/ });
      fireEvent.click(titleButton);
      
      expect(mockOnSortChange).toHaveBeenCalledWith('title');
    });

    it('resets sort when active column clicked again', () => {
      const mockOnSortChange = vi.fn();
      renderWithRouter(
        <ProblemsTable {...defaultProps} sortBy="title" onSortChange={mockOnSortChange} />
      );
      
      const titleButton = screen.getByRole('button', { name: /Sort by Title/ });
      fireEvent.click(titleButton);
      
      expect(mockOnSortChange).toHaveBeenCalledWith(null);
    });

    it('highlights active sort column with amber color', () => {
      renderWithRouter(<ProblemsTable {...defaultProps} sortBy="title" />);
      
      const titleButton = screen.getByRole('button', { name: /Sort by Title/ });
      const svg = titleButton.querySelector('svg');
      
      expect(svg).toHaveClass('text-amber-500');
    });
  });

  describe('Styling', () => {
    it('applies slate background colors', () => {
      const { container } = renderWithRouter(<ProblemsTable {...defaultProps} />);
      
      const tableContainer = container.querySelector('.bg-slate-850');
      expect(tableContainer).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = renderWithRouter(
        <ProblemsTable {...defaultProps} className="custom-class" />
      );
      
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('provides aria-label for sort buttons', () => {
      renderWithRouter(<ProblemsTable {...defaultProps} />);
      
      expect(screen.getByLabelText('Sort by Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Sort by Difficulty')).toBeInTheDocument();
    });
  });
});
