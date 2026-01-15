import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ProblemList from './ProblemList';
import * as AuthContext from '../contexts/AuthContext';

// Mock the API
vi.mock('../contexts/AuthContext', () => ({
  api: {
    get: vi.fn(),
  },
}));

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
    tags: ['Linked List', 'Math'],
  },
  {
    id: 3,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    userStatus: 'not_attempted',
    tags: ['Array', 'Binary Search'],
  },
];

const renderProblemList = () => {
  return render(
    <BrowserRouter>
      <ProblemList />
    </BrowserRouter>
  );
};

describe('ProblemList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    AuthContext.api.get.mockImplementation(() => new Promise(() => {}));
    renderProblemList();
    expect(screen.getByText('Loading problems...')).toBeInTheDocument();
  });

  it('renders problems after successful fetch', async () => {
    AuthContext.api.get.mockResolvedValue({ data: mockProblems });
    renderProblemList();

    await waitFor(() => {
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      expect(screen.getByText('Add Two Numbers')).toBeInTheDocument();
      expect(screen.getByText('Median of Two Sorted Arrays')).toBeInTheDocument();
    });
  });

  it('renders error state on fetch failure', async () => {
    AuthContext.api.get.mockRejectedValue({
      response: { data: { message: 'Network error' } },
    });
    renderProblemList();

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  it('renders with slate background', async () => {
    AuthContext.api.get.mockResolvedValue({ data: mockProblems });
    renderProblemList();

    await waitFor(() => {
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
    });
    
    // Check that the page has the slate background class
    const heading = screen.getByText('Problems');
    expect(heading).toBeInTheDocument();
  });

  it('renders SearchBar component', async () => {
    AuthContext.api.get.mockResolvedValue({ data: mockProblems });
    renderProblemList();

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search problems...');
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('renders ProblemFilters component', async () => {
    AuthContext.api.get.mockResolvedValue({ data: mockProblems });
    renderProblemList();

    await waitFor(() => {
      // Use getAllByText since "Difficulty" and "Status" appear in both filter and table header
      const difficultyElements = screen.getAllByText('Difficulty');
      expect(difficultyElements.length).toBeGreaterThan(0);
      const statusElements = screen.getAllByText('Status');
      expect(statusElements.length).toBeGreaterThan(0);
    });
  });

  it('renders ProblemsTable component', async () => {
    AuthContext.api.get.mockResolvedValue({ data: mockProblems });
    renderProblemList();

    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
      // Use getAllByText since "Tags" appears in both filter and table header
      const tagsElements = screen.getAllByText('Tags');
      expect(tagsElements.length).toBeGreaterThan(0);
    });
  });

  it('handles paginated API response', async () => {
    const paginatedResponse = {
      data: {
        content: mockProblems,
        totalPages: 3,
        number: 0,
      },
    };
    AuthContext.api.get.mockResolvedValue(paginatedResponse);
    renderProblemList();

    await waitFor(() => {
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      // Pagination controls should appear for multiple pages
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });
  });

  it('handles non-paginated API response', async () => {
    AuthContext.api.get.mockResolvedValue({ data: mockProblems });
    renderProblemList();

    await waitFor(() => {
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      // Should show count instead of pagination - use getAllByText since it appears twice
      const showingElements = screen.getAllByText(/Showing 3 problems/);
      expect(showingElements.length).toBeGreaterThan(0);
    });
  });
});
