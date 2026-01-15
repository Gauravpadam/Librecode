import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CodingQuote from './CodingQuote';
import * as quotes from '../../utils/quotes';

describe('CodingQuote', () => {
  it('renders a quote with text and author', () => {
    // Mock getRandomQuote to return a specific quote
    const mockQuote = {
      text: 'Test quote text',
      author: 'Test Author'
    };
    vi.spyOn(quotes, 'getRandomQuote').mockReturnValue(mockQuote);

    render(<CodingQuote />);

    expect(screen.getByText(/"Test quote text"/)).toBeInTheDocument();
    expect(screen.getByText(/Test Author/)).toBeInTheDocument();
  });

  it('displays quote in italic style', () => {
    const mockQuote = {
      text: 'Another test quote',
      author: 'Another Author'
    };
    vi.spyOn(quotes, 'getRandomQuote').mockReturnValue(mockQuote);

    render(<CodingQuote />);

    const quoteText = screen.getByText(/"Another test quote"/);
    expect(quoteText).toHaveClass('italic');
  });

  it('displays author in amber color', () => {
    const mockQuote = {
      text: 'Quote text',
      author: 'Famous Developer'
    };
    vi.spyOn(quotes, 'getRandomQuote').mockReturnValue(mockQuote);

    render(<CodingQuote />);

    const authorElement = screen.getByText(/Famous Developer/);
    expect(authorElement).toHaveClass('text-amber-400');
  });
});
