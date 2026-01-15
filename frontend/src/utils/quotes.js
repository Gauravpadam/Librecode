/**
 * Inspirational coding quotes from notable developers and tech leaders
 * Each quote is an object with text and author properties
 */

export const codingQuotes = [
  {
    text: "Any application that can be written in JavaScript, will eventually be written in JavaScript.",
    author: "Jeff Atwood"
  },
  {
    text: "I hate almost all software. It's unnecessary and complicated at almost every layer.",
    author: "Ryan Dahl"
  },
  {
    text: "Software is a great combination between artistry and engineering.",
    author: "Bill Gates"
  },
  {
    text: "The best error message is the one that never shows up.",
    author: "Thomas Fuchs"
  },
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House"
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  },
  {
    text: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman"
  },
  {
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck"
  },
  {
    text: "Clean code always looks like it was written by someone who cares.",
    author: "Robert C. Martin"
  },
  {
    text: "Programming isn't about what you know; it's about what you can figure out.",
    author: "Chris Pine"
  },
  {
    text: "The only way to learn a new programming language is by writing programs in it.",
    author: "Dennis Ritchie"
  },
  {
    text: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds"
  },
  {
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson"
  },
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler"
  },
  {
    text: "The most disastrous thing that you can ever learn is your first programming language.",
    author: "Alan Kay"
  }
];

/**
 * Get a random quote from the collection
 * @returns {Object} A quote object with text and author properties
 */
export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * codingQuotes.length);
  return codingQuotes[randomIndex];
};

export default codingQuotes;
