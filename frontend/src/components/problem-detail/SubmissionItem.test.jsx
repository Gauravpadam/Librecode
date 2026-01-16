import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubmissionItem from './SubmissionItem';
import * as submissionService from '../../services/submissionService';

// Mock the submission service
vi.mock('../../services/submissionService', () => ({
  getSubmissionById: vi.fn(),
}));

describe('SubmissionItem', () => {
  const mockSubmission = {
    id: 1,
    status: 'ACCEPTED',
    language: 'java',
    submittedAt: new Date().toISOString(),
    runtimeMs: 42,
    memoryKb: 15872, // 15.5 MB in KB
  };

  const mockSubmissionDetail = {
    ...mockSubmission,
    code: 'public class Solution {\n  public int add(int a, int b) {\n    return a + b;\n  }\n}',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders submission metadata correctly', () => {
    render(<SubmissionItem submission={mockSubmission} />);
    
    expect(screen.getByText('Accepted')).toBeInTheDocument();
    expect(screen.getByText('java')).toBeInTheDocument();
    expect(screen.getByText(/42ms/)).toBeInTheDocument();
    expect(screen.getByText(/15\.50MB/)).toBeInTheDocument();
  });

  it('displays relative time for recent submissions', () => {
    const recentSubmission = {
      ...mockSubmission,
      submittedAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
    };
    
    render(<SubmissionItem submission={recentSubmission} />);
    expect(screen.getByText(/5 minutes ago/)).toBeInTheDocument();
  });

  it('starts collapsed and shows "View code" text', () => {
    render(<SubmissionItem submission={mockSubmission} />);
    
    expect(screen.getByText('View code')).toBeInTheDocument();
    expect(screen.queryByText('Submitted Code')).not.toBeInTheDocument();
  });

  it('expands to show code when clicked', async () => {
    submissionService.getSubmissionById.mockResolvedValue(mockSubmissionDetail);
    
    render(<SubmissionItem submission={mockSubmission} />);
    
    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);
    
    // Should show loading state first
    expect(screen.getByText('Loading code...')).toBeInTheDocument();
    
    // Wait for code to load
    await waitFor(() => {
      expect(screen.getByText('Submitted Code')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Hide code')).toBeInTheDocument();
  });

  it('collapses code when clicked again', async () => {
    submissionService.getSubmissionById.mockResolvedValue(mockSubmissionDetail);
    
    render(<SubmissionItem submission={mockSubmission} />);
    
    const expandButton = screen.getByRole('button');
    
    // Expand
    fireEvent.click(expandButton);
    await waitFor(() => {
      expect(screen.getByText('Submitted Code')).toBeInTheDocument();
    });
    
    // Collapse
    fireEvent.click(expandButton);
    expect(screen.queryByText('Submitted Code')).not.toBeInTheDocument();
  });

  it('displays error message when fetch fails', async () => {
    submissionService.getSubmissionById.mockRejectedValue(new Error('Network error'));
    
    render(<SubmissionItem submission={mockSubmission} />);
    
    // Expand to trigger fetch
    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load code/)).toBeInTheDocument();
    });
  });

  it('displays error message from submission details when present', async () => {
    const errorSubmission = {
      ...mockSubmissionDetail,
      status: 'RUNTIME_ERROR',
      errorMessage: 'NullPointerException at line 5',
    };
    
    submissionService.getSubmissionById.mockResolvedValue(errorSubmission);
    
    render(<SubmissionItem submission={mockSubmission} />);
    
    // Expand to see error
    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error Message')).toBeInTheDocument();
      expect(screen.getByText(/NullPointerException/)).toBeInTheDocument();
    });
  });

  it('handles missing runtime and memory gracefully', () => {
    const submissionWithoutMetrics = {
      ...mockSubmission,
      runtimeMs: null,
      memoryKb: null,
    };
    
    render(<SubmissionItem submission={submissionWithoutMetrics} />);
    
    expect(screen.queryByText(/Runtime:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Memory:/)).not.toBeInTheDocument();
  });

  it('copies code to clipboard when copy button is clicked', async () => {
    // Mock clipboard API
    const writeTextMock = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
    
    submissionService.getSubmissionById.mockResolvedValue(mockSubmissionDetail);
    
    render(<SubmissionItem submission={mockSubmission} />);
    
    // Expand to see copy button
    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);
    
    // Wait for code to load
    await waitFor(() => {
      expect(screen.getByText('Submitted Code')).toBeInTheDocument();
    });
    
    // Click copy button
    const copyButton = screen.getByTitle('Copy code');
    fireEvent.click(copyButton);
    
    expect(writeTextMock).toHaveBeenCalledWith(mockSubmissionDetail.code);
  });

  it('displays different status badges with correct styling', () => {
    const statuses = ['ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED'];
    
    statuses.forEach((status) => {
      const { unmount } = render(
        <SubmissionItem submission={{ ...mockSubmission, status }} />
      );
      
      // Status should be converted to display format
      const displayStatus = status.split('_').map(word => 
        word.charAt(0) + word.slice(1).toLowerCase()
      ).join(' ');
      expect(screen.getByText(displayStatus)).toBeInTheDocument();
      unmount();
    });
  });

  it('capitalizes language name', () => {
    render(<SubmissionItem submission={mockSubmission} />);
    
    const languageElement = screen.getByText('java');
    expect(languageElement).toHaveClass('capitalize');
  });
});
