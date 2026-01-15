import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsCard from './StatsCard';

describe('StatsCard', () => {
  it('renders title and numeric value', () => {
    render(<StatsCard title="Problems Solved" value={42} />);

    expect(screen.getByText('Problems Solved')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders string value', () => {
    render(<StatsCard title="Accuracy" value="85%" />);

    expect(screen.getByText('Accuracy')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('renders placeholder for undefined value', () => {
    render(<StatsCard title="Test Stat" value={undefined} />);

    expect(screen.getByText('Test Stat')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders placeholder for null value', () => {
    render(<StatsCard title="Test Stat" value={null} />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<StatsCard title="Test" value={10} icon="✓" />);

    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatsCard title="Test" value={5} className="custom-class" />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });
});
