import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SolutionsTab from './SolutionsTab';
import * as submissionService from '../../services/submissionService';

// Mock the submission service
vi.mock('../../services/submissionService', () => ({
  getProblemSubmissions: vi.fn(),
}));

// Mock SubmissionItem to simplify testing
vi.mock('./SubmissionItem', () => ({
  default: ({ submission }) => (
    <div data-testid={`submission-${submission.id}`}>
      {submission.status} - {submission.language}
    </div>
  ),
}));

describe('SolutionsTab', () => {
  const mockSubmissions = [
    {
      id: 1,
      status: 'ACCEPTED',
      language: 'java',
      submittedAt: '2024-01-15T10:00:00Z',
      runtimeMs: 42,
      memoryKb: 15872,
    },
    {
      id: 2,
      status: 'WRONG_ANSWER',
      language: 'python',
      submittedAt: '2024-01-15T09:00:00Z',
      runtimeMs: 38,
      memoryKb: 12595,
    },
    {
      id: 3,
      status: 'TIME_LIMIT_EXCEEDED',
      language: 'javascript',
      submittedAt: '2024-01-15T08:00:00Z',
      runtimeMs: null,
      memoryKb: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    submissionService.getProblemSubmissions.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<SolutionsTab problemId={1} />);
    
    expect(screen.getByText('Loading submissions...')).toBeInTheDocument();
  });

  it('fetches and displays submissions for the given problem', async () => {
    submissionService.getProblemSubmissions.mockResolvedValue(mockSubmissions);

    render(<SolutionsTab problemId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Your Submissions')).toBeInTheDocument();
    });

    expect(screen.getByText('3 submissions found')).toBeInTheDocument();
    expect(screen.getByTestId('submission-1')).toBeInTheDocument();
    expect(screen.getByTestId('submission-2')).toBeInTheDocument();
    expect(screen.getByTestId('submission-3')).toBeInTheDocument();
  });

  it('displays submissions in reverse chronological order (newest first)', async () => {
    submissionService.getProblemSubmissions.mockResolvedValue(mockSubmissions);

    render(<SolutionsTab problemId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Your Submissions')).toBeInTheDocument();
    });

    const submissions = screen.getAllByTestId(/submission-/);
    // Should be ordered by id: 1, 2, 3 (newest to oldest based on submittedAt)
    expect(submissions[0]).toHaveAttribute('data-testid', 'submission-1');
    expect(submissions[1]).toHaveAttribute('data-testid', 'submission-2');
    expect(submissions[2]).toHaveAttribute('data-testid', 'submission-3');
  });

  it('displays empty state when no submissions exist', async () => {
    submissionService.getProblemSubmissions.mockResolvedValue([]);

    render(<SolutionsTab problemId={1} />);

    await waitFor(() => {
      expect(screen.getByText('No Submissions Yet')).toBeInTheDocument();
    });

    expect(screen.getByText(/You haven't submitted any solutions/)).toBeInTheDocument();
  });

  it('displays error state when fetch fails', async () => {
    submissionService.getProblemSubmissions.mockRejectedValue(
      new Error('Network error')
    );

    render(<SolutionsTab problemId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Error Loading Submissions')).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to load submissions/)).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('calls API with correct problem ID', async () => {
    submissionService.getProblemSubmissions.mockResolvedValue([]);

    render(<SolutionsTab problemId={42} />);

    await waitFor(() => {
      expect(submissionService.getProblemSubmissions).toHaveBeenCalledWith(42);
    });
  });

  it('handles string problem ID', async () => {
    submissionService.getProblemSubmissions.mockResolvedValue([]);

    render(<SolutionsTab problemId="42" />);

    await waitFor(() => {
      expect(submissionService.getProblemSubmissions).toHaveBeenCalledWith("42");
    });
  });

  it('displays singular "submission" for single submission', async () => {
    submissionService.getProblemSubmissions.mockResolvedValue([mockSubmissions[0]]);

    render(<SolutionsTab problemId={1} />);

    await waitFor(() => {
      expect(screen.getByText('1 submission found')).toBeInTheDocument();
    });
  });

  it('displays plural "submissions" for multiple submissions', async () => {
    submissionService.getProblemSubmissions.mockResolvedValue(mockSubmissions);

    render(<SolutionsTab problemId={1} />);

    await waitFor(() => {
      expect(screen.getByText('3 submissions found')).toBeInTheDocument();
    });
  });

  it('refetches submissions when problemId changes', async () => {
    submissionService.getProblemSubmissions.mockResolvedValue([mockSubmissions[0]]);

    const { rerender } = render(<SolutionsTab problemId={1} />);

    await waitFor(() => {
      expect(submissionService.getProblemSubmissions).toHaveBeenCalledWith(1);
    });

    // Change problem ID
    submissionService.getProblemSubmissions.mockResolvedValue([mockSubmissions[1]]);
    rerender(<SolutionsTab problemId={2} />);

    await waitFor(() => {
      expect(submissionService.getProblemSubmissions).toHaveBeenCalledWith(2);
    });

    expect(submissionService.getProblemSubmissions).toHaveBeenCalledTimes(2);
  });

  it('handles null/undefined submissions gracefully', async () => {
    submissionService.getProblemSubmissions.mockResolvedValue(null);

    render(<SolutionsTab problemId={1} />);

    await waitFor(() => {
      expect(screen.getByText('No Submissions Yet')).toBeInTheDocument();
    });
  });
});
