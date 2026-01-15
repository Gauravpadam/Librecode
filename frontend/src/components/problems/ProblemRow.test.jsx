import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import ProblemRow from './ProblemRow';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock DifficultyBadge
vi.mock('../common/DifficultyBadge', () => ({
  default: ({ difficulty }) => <span data-testid="difficulty-badge">{difficulty}</span>,
}));

describe('ProblemRow', () => {
  const mockNavigate = vi.fn();

  const mockProblem = {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    userStatus: 'solved',
    tags: ['Array', 'Hash Table'],
  };

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  describe('Rendering', () => {
    it('renders problem title', () => {
      renderWithRouter(<ProblemRow problem={mockProblem} />);
      
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
    });

    it('renders difficulty badge', () => {
      renderWithRouter(<ProblemRow problem={mockProblem} />);
      
      const badge = screen.getByTestId('difficulty-badge');
      expect(badge).toHaveTextContent('Easy');
    });

    it('renders tags', () => {
      renderWithRouter(<ProblemRow problem={mockProblem} />);
      
      expect(screen.getByText('Array')).toBeInTheDocument();
      expect(screen.getByText('Hash Table')).toBeInTheDocument();
    });

    it('shows only first 3 tags with overflow indicator', () => {
      const problemWithManyTags = {
        ...mockProblem,
        tags: ['Array', 'Hash Table', 'String', 'Dynamic Programming', 'Math'],
      };
      
      renderWithRouter(<ProblemRow problem={problemWithManyTags} />);
      
      expect(screen.getByText('Array')).toBeInTheDocument();
      expect(screen.getByText('Hash Table')).toBeInTheDocument();
      expect(screen.getByText('String')).toBeInTheDocument();
      expect(screen.getByText('+2')).toBeInTheDocument();
      expect(screen.queryByText('Dynamic Programming')).not.toBeInTheDocument();
    });

    it('shows dash when no tags', () => {
      const problemWithoutTags = { ...mockProblem, tags: [] };
      
      renderWithRouter(<ProblemRow problem={problemWithoutTags} />);
      
      expect(screen.getByText('—')).toBeInTheDocument();
    });
  });

  describe('Status Icons', () => {
    it('shows checkmark icon for solved problems', () => {
      renderWithRouter(<ProblemRow problem={mockProblem} />);
      
      const statusCell = screen.getByTitle('Solved');
      expect(statusCell).toBeInTheDocument();
    });

    it('shows play icon for attempted problems', () => {
      const attemptedProblem = { ...mockProblem, userStatus: 'attempted' };
      
      renderWithRouter(<ProblemRow problem={attemptedProblem} />);
      
      const statusCell = screen.getByTitle('Attempted');
      expect(statusCell).toBeInTheDocument();
    });

    it('shows circle icon for not attempted problems', () => {
      const notAttemptedProblem = { ...mockProblem, userStatus: 'not_attempted' };
      
      renderWithRouter(<ProblemRow problem={notAttemptedProblem} />);
      
      const statusCell = screen.getByTitle('Not Attempted');
      expect(statusCell).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('navigates to problem detail on click', () => {
      renderWithRouter(<ProblemRow problem={mockProblem} />);
      
      const row = screen.getByRole('button', { name: /View problem: Two Sum/ });
      fireEvent.click(row);
      
      expect(mockNavigate).toHaveBeenCalledWith('/problems/1');
    });

    it('navigates on Enter key press', () => {
      renderWithRouter(<ProblemRow problem={mockProblem} />);
      
      const row = screen.getByRole('button', { name: /View problem: Two Sum/ });
      fireEvent.keyDown(row, { key: 'Enter', code: 'Enter' });
      
      expect(mockNavigate).toHaveBeenCalledWith('/problems/1');
    });

    it('navigates on Space key press', () => {
      renderWithRouter(<ProblemRow problem={mockProblem} />);
      
      const row = screen.getByRole('button', { name: /View problem: Two Sum/ });
      fireEvent.keyDown(row, { key: ' ', code: 'Space' });
      
      expect(mockNavigate).toHaveBeenCalledWith('/problems/1');
    });

    it('does not navigate on other key presses', () => {
      renderWithRouter(<ProblemRow problem={mockProblem} />);
      
      const row = screen.getByRole('button', { name: /View problem: Two Sum/ });
      fireEvent.keyDown(row, { key: 'a', code: 'KeyA' });
      
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper role and aria-label', () => {
      renderWithRouter(<ProblemRow problem={mockProblem} />);
      
      const row = screen.getByRole('button', { name: 'View problem: Two Sum' });
      expect(row).toBeInTheDocument();
    });

    it('is keyboard focusable', () => {
      renderWithRouter(<ProblemRow problem={mockProblem} />);
      
      const row = screen.getByRole('button');
      expect(row).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Optional Fields', () => {
    it('renders acceptance rate when provided', () => {
      const problemWithAcceptance = { ...mockProblem, acceptanceRate: 45.5 };
      
      renderWithRouter(<ProblemRow problem={problemWithAcceptance} />);
      
      expect(screen.getByText('45.5%')).toBeInTheDocument();
    });

    it('does not render acceptance rate column when not provided', () => {
      renderWithRouter(<ProblemRow problem={mockProblem} />);
      
      expect(screen.queryByText('%')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies hover styles', () => {
      renderWithRouter(<ProblemRow problem={mockProblem} />);
      
      const row = screen.getByRole('button');
      expect(row).toHaveClass('hover:bg-slate-800');
    });

    it('applies cursor pointer', () => {
      renderWithRouter(<ProblemRow problem={mockProblem} />);
      
      const row = screen.getByRole('button');
      expect(row).toHaveClass('cursor-pointer');
    });
  });
});
