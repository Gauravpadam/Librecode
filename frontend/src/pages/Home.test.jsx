import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import { AuthProvider } from '../contexts/AuthContext';
import * as submissionService from '../services/submissionService';

// Mock the submission service
vi.mock('../services/submissionService', () => ({
  getStats: vi.fn(),
  getSubmissions: vi.fn(),
}));

// Helper to render with providers
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
};

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  it('renders coding quote', async () => {
    renderWithProviders(<Home />);

    // Wait for component to render
    await waitFor(() => {
      // Check if a quote is displayed (look for the dash which is part of the author format)
      const quoteElements = screen.getAllByText(/—/);
      expect(quoteElements.length).toBeGreaterThan(0);
    });
  });

  it('shows welcome message for non-authenticated users', async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Welcome to LocalCode')).toBeInTheDocument();
      expect(screen.getByText(/Practice coding problems/)).toBeInTheDocument();
    });
  });

  it('fetches and displays stats for authenticated users', async () => {
    // Mock authenticated user
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'testuser' }));

    // Mock API responses
    submissionService.getStats.mockResolvedValue({
      solvedProblems: 10,
      totalSubmissions: 25,
      acceptedSubmissions: 15,
    });

    submissionService.getSubmissions.mockResolvedValue([]);

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Problems Solved')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('Total Submissions')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('Accuracy')).toBeInTheDocument();
      expect(screen.getByText('60%')).toBeInTheDocument(); // 15/25 = 60%
    });
  });

  it('displays recent submissions for authenticated users', async () => {
    // Mock authenticated user
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'testuser' }));

    // Mock API responses
    submissionService.getStats.mockResolvedValue({
      solvedProblems: 5,
      totalSubmissions: 10,
      acceptedSubmissions: 5,
    });

    submissionService.getSubmissions.mockResolvedValue([
      {
        id: 1,
        problemId: 101,
        problemTitle: 'Two Sum',
        status: 'Accepted',
        language: 'java',
        submittedAt: '2024-01-15T10:30:00Z',
        runtime: 150,
      },
    ]);

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Recent Submissions')).toBeInTheDocument();
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      expect(screen.getByText('Accepted')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock authenticated user
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'testuser' }));

    // Mock API errors
    submissionService.getStats.mockRejectedValue(new Error('API Error'));
    submissionService.getSubmissions.mockRejectedValue(new Error('API Error'));

    // Spy on console.error to suppress error output in tests
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<Home />);

    await waitFor(() => {
      // Should still render the page structure
      expect(screen.getByText('Problems Solved')).toBeInTheDocument();
      // Stats should show default values
      expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    });

    consoleErrorSpy.mockRestore();
  });
});
