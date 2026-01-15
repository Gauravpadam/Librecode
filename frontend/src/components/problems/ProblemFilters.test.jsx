import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProblemFilters from './ProblemFilters';

describe('ProblemFilters', () => {
  const defaultProps = {
    difficulty: 'all',
    onDifficultyChange: vi.fn(),
    status: 'all',
    onStatusChange: vi.fn(),
    tags: [],
    onTagsChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Difficulty Filter', () => {
    it('renders all difficulty options', () => {
      render(<ProblemFilters {...defaultProps} />);
      
      const allButtons = screen.getAllByText('All');
      expect(allButtons.length).toBeGreaterThan(0);
      expect(screen.getByText('Easy')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Hard')).toBeInTheDocument();
    });

    it('highlights active difficulty with amber background', () => {
      render(<ProblemFilters {...defaultProps} difficulty="easy" />);
      
      const easyButton = screen.getByRole('button', { name: 'Easy' });
      expect(easyButton).toHaveClass('bg-amber-500');
    });

    it('calls onDifficultyChange when difficulty button clicked', () => {
      const mockOnChange = vi.fn();
      render(<ProblemFilters {...defaultProps} onDifficultyChange={mockOnChange} />);
      
      const mediumButton = screen.getByRole('button', { name: 'Medium' });
      fireEvent.click(mediumButton);
      
      expect(mockOnChange).toHaveBeenCalledWith('medium');
    });
  });

  describe('Status Filter', () => {
    it('renders all status options', () => {
      render(<ProblemFilters {...defaultProps} />);
      
      const allButtons = screen.getAllByRole('button', { name: 'All' });
      expect(allButtons.length).toBe(2); // One for difficulty, one for status
      expect(screen.getByRole('button', { name: 'Solved' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Attempted' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Unsolved' })).toBeInTheDocument();
    });

    it('highlights active status with amber background', () => {
      render(<ProblemFilters {...defaultProps} status="solved" />);
      
      const solvedButton = screen.getByRole('button', { name: 'Solved' });
      expect(solvedButton).toHaveClass('bg-amber-500');
    });

    it('calls onStatusChange when status button clicked', () => {
      const mockOnChange = vi.fn();
      render(<ProblemFilters {...defaultProps} onStatusChange={mockOnChange} />);
      
      const attemptedButton = screen.getByRole('button', { name: 'Attempted' });
      fireEvent.click(attemptedButton);
      
      expect(mockOnChange).toHaveBeenCalledWith('attempted');
    });
  });

  describe('Tags Filter', () => {
    it('does not render tags section when no available tags', () => {
      render(<ProblemFilters {...defaultProps} availableTags={[]} />);
      
      expect(screen.queryByText('Tags')).not.toBeInTheDocument();
    });

    it('renders tags section when available tags provided', () => {
      const availableTags = ['Array', 'String', 'Dynamic Programming'];
      render(<ProblemFilters {...defaultProps} availableTags={availableTags} />);
      
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Array' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'String' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Dynamic Programming' })).toBeInTheDocument();
    });

    it('highlights selected tags with amber background', () => {
      const availableTags = ['Array', 'String'];
      render(
        <ProblemFilters 
          {...defaultProps} 
          tags={['Array']} 
          availableTags={availableTags} 
        />
      );
      
      const arrayButton = screen.getByRole('button', { name: 'Array' });
      expect(arrayButton).toHaveClass('bg-amber-500');
    });

    it('adds tag when unselected tag clicked', () => {
      const mockOnChange = vi.fn();
      const availableTags = ['Array', 'String'];
      render(
        <ProblemFilters 
          {...defaultProps} 
          tags={[]} 
          onTagsChange={mockOnChange}
          availableTags={availableTags} 
        />
      );
      
      const arrayButton = screen.getByRole('button', { name: 'Array' });
      fireEvent.click(arrayButton);
      
      expect(mockOnChange).toHaveBeenCalledWith(['Array']);
    });

    it('removes tag when selected tag clicked', () => {
      const mockOnChange = vi.fn();
      const availableTags = ['Array', 'String'];
      render(
        <ProblemFilters 
          {...defaultProps} 
          tags={['Array', 'String']} 
          onTagsChange={mockOnChange}
          availableTags={availableTags} 
        />
      );
      
      const arrayButton = screen.getByRole('button', { name: 'Array' });
      fireEvent.click(arrayButton);
      
      expect(mockOnChange).toHaveBeenCalledWith(['String']);
    });
  });

  describe('Active Filters Summary', () => {
    it('does not show summary when all filters are default', () => {
      render(<ProblemFilters {...defaultProps} />);
      
      expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
    });

    it('shows summary when difficulty filter is active', () => {
      render(<ProblemFilters {...defaultProps} difficulty="easy" />);
      
      expect(screen.getByText(/Difficulty: easy/)).toBeInTheDocument();
      expect(screen.getByText('Clear all')).toBeInTheDocument();
    });

    it('shows summary when status filter is active', () => {
      render(<ProblemFilters {...defaultProps} status="solved" />);
      
      expect(screen.getByText(/Status: solved/)).toBeInTheDocument();
    });

    it('shows summary when tags are selected', () => {
      render(
        <ProblemFilters 
          {...defaultProps} 
          tags={['Array', 'String']} 
          availableTags={['Array', 'String']}
        />
      );
      
      expect(screen.getByText(/Tags: 2/)).toBeInTheDocument();
    });

    it('clears all filters when Clear all clicked', () => {
      const mockDifficultyChange = vi.fn();
      const mockStatusChange = vi.fn();
      const mockTagsChange = vi.fn();
      
      render(
        <ProblemFilters 
          difficulty="easy"
          onDifficultyChange={mockDifficultyChange}
          status="solved"
          onStatusChange={mockStatusChange}
          tags={['Array']}
          onTagsChange={mockTagsChange}
          availableTags={['Array']}
        />
      );
      
      const clearButton = screen.getByText('Clear all');
      fireEvent.click(clearButton);
      
      expect(mockDifficultyChange).toHaveBeenCalledWith('all');
      expect(mockStatusChange).toHaveBeenCalledWith('all');
      expect(mockTagsChange).toHaveBeenCalledWith([]);
    });
  });

  describe('Accessibility', () => {
    it('sets aria-pressed on active filter buttons', () => {
      render(<ProblemFilters {...defaultProps} difficulty="easy" />);
      
      const easyButton = screen.getByRole('button', { name: 'Easy' });
      expect(easyButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('applies custom className', () => {
      const { container } = render(
        <ProblemFilters {...defaultProps} className="custom-class" />
      );
      
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
