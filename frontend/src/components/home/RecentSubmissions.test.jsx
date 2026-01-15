import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import RecentSubmissions from './RecentSubmissions';

// Helper to render with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('RecentSubmissions', () => {
  it('displays loading state', () => {
    renderWithRouter(<RecentSubmissions loading={true} />);

    expect(screen.getByText('Recent Submissions')).toBeInTheDocument();
    expect(screen.getByText('Loading submissions...')).toBeInTheDocument();
  });

  it('displays empty state when no submissions', () => {
    renderWithRouter(<RecentSubmissions submissions={[]} loading={false} />);

    expect(screen.getByText('Recent Submissions')).toBeInTheDocument();
    expect(screen.getByText(/No submissions yet/)).toBeInTheDocument();
    expect(screen.getByText('Browse Problems →')).toBeInTheDocument();
  });

  it('renders list of submissions', () => {
    const submissions = [
      {
        id: 1,
        problemId: 101,
        problemTitle: 'Two Sum',
        status: 'Accepted',
        language: 'java',
        submittedAt: '2024-01-15T10:30:00Z',
        runtime: 150,
      },
      {
        id: 2,
        problemId: 102,
        problemTitle: 'Reverse String',
        status: 'Wrong Answer',
        language: 'python',
        submittedAt: '2024-01-14T15:20:00Z',
        runtime: 200,
      },
    ];

    renderWithRouter(<RecentSubmissions submissions={submissions} loading={false} />);

    expect(screen.getByText('Two Sum')).toBeInTheDocument();
    expect(screen.getByText('Reverse String')).toBeInTheDocument();
    expect(screen.getByText('Accepted')).toBeInTheDocument();
    expect(screen.getByText('Wrong Answer')).toBeInTheDocument();
  });

  it('displays submission metadata correctly', () => {
    const submissions = [
      {
        id: 1,
        problemId: 101,
        problemTitle: 'Test Problem',
        status: 'Accepted',
        language: 'javascript',
        submittedAt: '2024-01-15T10:30:00Z',
        runtime: 100,
      },
    ];

    renderWithRouter(<RecentSubmissions submissions={submissions} loading={false} />);

    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByText('100ms')).toBeInTheDocument();
  });

  it('shows "View All Submissions" link when 5 or more submissions', () => {
    const submissions = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      problemId: 100 + i,
      problemTitle: `Problem ${i + 1}`,
      status: 'Accepted',
      language: 'java',
      submittedAt: '2024-01-15T10:30:00Z',
    }));

    renderWithRouter(<RecentSubmissions submissions={submissions} loading={false} />);

    expect(screen.getByText('View All Submissions →')).toBeInTheDocument();
  });

  it('does not show "View All" link when less than 5 submissions', () => {
    const submissions = [
      {
        id: 1,
        problemId: 101,
        problemTitle: 'Test Problem',
        status: 'Accepted',
        language: 'java',
        submittedAt: '2024-01-15T10:30:00Z',
      },
    ];

    renderWithRouter(<RecentSubmissions submissions={submissions} loading={false} />);

    expect(screen.queryByText('View All Submissions →')).not.toBeInTheDocument();
  });

  it('handles missing problemTitle gracefully', () => {
    const submissions = [
      {
        id: 1,
        problemId: 101,
        status: 'Accepted',
        language: 'java',
        submittedAt: '2024-01-15T10:30:00Z',
      },
    ];

    renderWithRouter(<RecentSubmissions submissions={submissions} loading={false} />);

    expect(screen.getByText('Problem #101')).toBeInTheDocument();
  });
});
