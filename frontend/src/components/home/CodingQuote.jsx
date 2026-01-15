import { useState, useEffect } from 'react';
import { getRandomQuote } from '../../utils/quotes';
import Card from '../common/Card';

/**
 * CodingQuote component
 * Displays a random inspirational coding quote
 */
function CodingQuote() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    // Get a random quote on component mount
    setQuote(getRandomQuote());
  }, []);

  if (!quote) {
    return null;
  }

  return (
    <Card className="text-center">
      <blockquote className="space-y-4">
        <p className="text-xl md:text-2xl font-sans text-slate-100 italic">
          "{quote.text}"
        </p>
        <footer className="text-amber-400 font-medium">
          — {quote.author}
        </footer>
      </blockquote>
    </Card>
  );
}

export default CodingQuote;
