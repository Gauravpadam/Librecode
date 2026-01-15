import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProblemDescription from './ProblemDescription';

describe('ProblemDescription', () => {
  const mockProblem = {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    tags: ['Array', 'Hash Table'],
  };

  const mockTestCases = [
    {
      id: 1,
      input: '[2,7,11,15], target = 9',
      expectedOutput: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      isSample: true,
    },
    {
      id: 2,
      input: '[3,2,4], target = 6',
      expectedOutput: '[1,2]',
      explanation: null,
      isSample: true,
    },
    {
      id: 3,
      input: '[1,2,3], target = 5',
      expectedOutput: '[1,2]',
      isSample: false, // Not a sample, should not be displayed
    },
  ];

  describe('Tab Navigation', () => {
    it('renders all three tabs', () => {
      render(<ProblemDescription problem={mockProblem} testCases={mockTestCases} />);

      expect(screen.getByRole('button', { name: 'Description' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Solutions' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submissions' })).toBeInTheDocument();
    });

    it('shows description tab by default', () => {
      render(<ProblemDescription problem={mockProblem} testCases={mockTestCases} />);

      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      expect(screen.getByText(/Given an array of integers/)).toBeInTheDocument();
    });

    it('switches to solutions tab when clicked', () => {
      render(<ProblemDescription problem={mockProblem} testCases={mockTestCases} />);

      const solutionsTab = screen.getByText('Solutions');
      fireEvent.click(solutionsTab);

      expect(screen.getByText(/Solutions tab content will be implemented/)).toBeInTheDocument();
    });

    it('switches to submissions tab when clicked', () => {
      render(<ProblemDescription problem={mockProblem} testCases={mockTestCases} />);

      const submissionsTab = screen.getByText('Submissions');
      fireEvent.click(submissionsTab);

      expect(screen.getByText(/Submissions tab content will be implemented/)).toBeInTheDocument();
    });

    it('applies active styling to selected tab', () => {
      render(<ProblemDescription problem={mockProblem} testCases={mockTestCases} />);

      const descriptionTab = screen.getByRole('button', { name: 'Description' });
      expect(descriptionTab).toHaveClass('text-primary');
      expect(descriptionTab).toHaveClass('border-primary');
    });
  });

  describe('Description Tab Content', () => {
    it('renders problem title', () => {
      render(<ProblemDescription problem={mockProblem} testCases={mockTestCases} />);

      expect(screen.getByText('Two Sum')).toBeInTheDocument();
    });

    it('renders problem description', () => {
      render(<ProblemDescription problem={mockProblem} testCases={mockTestCases} />);

      expect(screen.getByText(/Given an array of integers/)).toBeInTheDocument();
    });

    it('renders constraints with monospace font', () => {
      render(<ProblemDescription problem={mockProblem} testCases={mockTestCases} />);

      const constraintsSection = screen.getByText(/2 <= nums.length <= 10\^4/);
      expect(constraintsSection).toBeInTheDocument();
      expect(constraintsSection).toHaveClass('font-mono');
    });

    it('renders time and memory limits', () => {
      render(<ProblemDescription problem={mockProblem} testCases={mockTestCases} />);

      expect(screen.getByText('1000ms')).toBeInTheDocument();
      expect(screen.getByText('256MB')).toBeInTheDocument();
    });

    it('renders tags when available', () => {
      render(<ProblemDescription problem={mockProblem} testCases={mockTestCases} />);

      expect(screen.getByText('Array')).toBeInTheDocument();
      expect(screen.getByText('Hash Table')).toBeInTheDocument();
    });

    it('does not render tags section when tags are empty', () => {
      const problemWithoutTags = { ...mockProblem, tags: [] };
      render(<ProblemDescription problem={problemWithoutTags} testCases={mockTestCases} />);

      expect(screen.queryByText('Tags')).not.toBeInTheDocument();
    });
  });

  describe('Example Test Cases', () => {
    it('renders only sample test cases', () => {
      render(<ProblemDescription problem={mockProblem} testCases={mockTestCases} />);

      expect(screen.getByText('Example 1')).toBeInTheDocument();
      expect(screen.getByText('Example 2')).toBeInTheDocument();
      expect(screen.queryByText('Example 3')).not.toBeInTheDocument();
    });

    it('renders test case input and output with monospace font', () => {
      render(<ProblemDescription problem={mockProblem} testCases={mockTestCases} />);

      const input = screen.getByText('[2,7,11,15], target = 9');
      const output = screen.getByText('[0,1]');

      expect(input).toBeInTheDocument();
      expect(output).toBeInTheDocument();
      expect(input).toHaveClass('font-mono');
      expect(output).toHaveClass('font-mono');
    });

    it('renders explanation when available', () => {
      render(<ProblemDescription problem={mockProblem} testCases={mockTestCases} />);

      expect(screen.getByText(/Because nums\[0\] \+ nums\[1\] == 9/)).toBeInTheDocument();
    });

    it('does not render explanation section when not available', () => {
      render(<ProblemDescription problem={mockProblem} testCases={mockTestCases} />);

      // Example 2 has no explanation
      const examples = screen.getAllByText(/Example \d/);
      expect(examples).toHaveLength(2);
    });

    it('handles empty test cases array', () => {
      render(<ProblemDescription problem={mockProblem} testCases={[]} />);

      expect(screen.queryByText('Examples')).not.toBeInTheDocument();
    });
  });

  describe('Color Scheme', () => {
    it('applies background color to main container', () => {
      const { container } = render(
        <ProblemDescription problem={mockProblem} testCases={mockTestCases} />
      );

      const mainContainer = container.querySelector('.bg-background');
      expect(mainContainer).toBeInTheDocument();
    });

    it('applies slate-850 background to tab headers', () => {
      const { container } = render(
        <ProblemDescription problem={mockProblem} testCases={mockTestCases} />
      );

      const tabHeader = container.querySelector('.bg-slate-850');
      expect(tabHeader).toBeInTheDocument();
    });

    it('applies primary color to active tab', () => {
      render(<ProblemDescription problem={mockProblem} testCases={mockTestCases} />);

      const activeTab = screen.getByRole('button', { name: 'Description' });
      expect(activeTab).toHaveClass('text-primary');
    });
  });

  describe('Custom Tab Content', () => {
    it('renders custom solutions tab content when provided', () => {
      const customSolutionsTab = <div>Custom Solutions Content</div>;
      
      render(
        <ProblemDescription
          problem={mockProblem}
          testCases={mockTestCases}
          solutionsTab={customSolutionsTab}
        />
      );

      fireEvent.click(screen.getByText('Solutions'));
      expect(screen.getByText('Custom Solutions Content')).toBeInTheDocument();
    });

    it('renders custom submissions tab content when provided', () => {
      const customSubmissionsTab = <div>Custom Submissions Content</div>;
      
      render(
        <ProblemDescription
          problem={mockProblem}
          testCases={mockTestCases}
          submissionsTab={customSubmissionsTab}
        />
      );

      fireEvent.click(screen.getByText('Submissions'));
      expect(screen.getByText('Custom Submissions Content')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading message when problem is null', () => {
      render(<ProblemDescription problem={null} testCases={[]} />);

      expect(screen.getByText('Loading problem details...')).toBeInTheDocument();
    });
  });
});
