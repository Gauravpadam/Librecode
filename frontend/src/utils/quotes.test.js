import { describe, it, expect } from 'vitest';
import { codingQuotes, getRandomQuote } from './quotes.js';

describe('quotes utility', () => {
  describe('codingQuotes array', () => {
    it('should export an array of quotes', () => {
      expect(Array.isArray(codingQuotes)).toBe(true);
      expect(codingQuotes.length).toBeGreaterThan(0);
    });

    it('should have at least 10 quotes', () => {
      expect(codingQuotes.length).toBeGreaterThanOrEqual(10);
    });

    it('should have quotes with text and author properties', () => {
      codingQuotes.forEach((quote) => {
        expect(quote).toHaveProperty('text');
        expect(quote).toHaveProperty('author');
        expect(typeof quote.text).toBe('string');
        expect(typeof quote.author).toBe('string');
      });
    });

    it('should have non-empty text and author for all quotes', () => {
      codingQuotes.forEach((quote) => {
        expect(quote.text.length).toBeGreaterThan(0);
        expect(quote.author.length).toBeGreaterThan(0);
      });
    });

    it('should include a quote from Ryan Dahl', () => {
      const ryanDahlQuote = codingQuotes.find(
        (quote) => quote.author === 'Ryan Dahl'
      );
      expect(ryanDahlQuote).toBeDefined();
      expect(ryanDahlQuote.text).toBeTruthy();
    });

    it('should have diverse authors', () => {
      const authors = codingQuotes.map((quote) => quote.author);
      const uniqueAuthors = new Set(authors);
      // Should have at least 10 different authors
      expect(uniqueAuthors.size).toBeGreaterThanOrEqual(10);
    });

    it('should have quotes from notable tech leaders', () => {
      const authors = codingQuotes.map((quote) => quote.author);
      const notableAuthors = [
        'Ryan Dahl',
        'Linus Torvalds',
        'Bill Gates',
        'Martin Fowler',
        'Robert C. Martin',
      ];
      
      // At least some notable authors should be present
      const foundNotableAuthors = notableAuthors.filter((author) =>
        authors.includes(author)
      );
      expect(foundNotableAuthors.length).toBeGreaterThan(0);
    });
  });

  describe('getRandomQuote function', () => {
    it('should return a quote object', () => {
      const quote = getRandomQuote();
      expect(quote).toBeDefined();
      expect(quote).toHaveProperty('text');
      expect(quote).toHaveProperty('author');
    });

    it('should return a quote from the codingQuotes array', () => {
      const quote = getRandomQuote();
      const isInArray = codingQuotes.some(
        (q) => q.text === quote.text && q.author === quote.author
      );
      expect(isInArray).toBe(true);
    });

    it('should return different quotes on multiple calls (probabilistic)', () => {
      // Call getRandomQuote multiple times
      const quotes = new Set();
      for (let i = 0; i < 20; i++) {
        const quote = getRandomQuote();
        quotes.add(quote.text);
      }
      
      // With 15 quotes and 20 calls, we should get at least 2 different quotes
      // (This is probabilistic but very likely to pass)
      expect(quotes.size).toBeGreaterThan(1);
    });

    it('should return valid quote objects every time', () => {
      // Test multiple calls
      for (let i = 0; i < 10; i++) {
        const quote = getRandomQuote();
        expect(typeof quote.text).toBe('string');
        expect(typeof quote.author).toBe('string');
        expect(quote.text.length).toBeGreaterThan(0);
        expect(quote.author.length).toBeGreaterThan(0);
      }
    });
  });

  describe('quote content quality', () => {
    it('should have meaningful quote text (not too short)', () => {
      codingQuotes.forEach((quote) => {
        // Quotes should be at least 20 characters
        expect(quote.text.length).toBeGreaterThan(20);
      });
    });

    it('should have properly formatted author names', () => {
      codingQuotes.forEach((quote) => {
        // Author names should not be empty and should be reasonable length
        expect(quote.author.length).toBeGreaterThan(2);
        expect(quote.author.length).toBeLessThan(50);
      });
    });
  });
});
