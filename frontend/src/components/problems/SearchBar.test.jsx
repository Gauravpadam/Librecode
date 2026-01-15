import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders with placeholder text', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('Search problems...');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const mockOnChange = vi.fn();
    render(
      <SearchBar 
        value="" 
        onChange={mockOnChange} 
        placeholder="Custom placeholder" 
      />
    );
    
    const input = screen.getByPlaceholderText('Custom placeholder');
    expect(input).toBeInTheDocument();
  });

  it('displays the current value', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="test query" onChange={mockOnChange} />);
    
    const input = screen.getByDisplayValue('test query');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('Search problems...');
    fireEvent.change(input, { target: { value: 'new search' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('new search');
  });

  it('renders search icon', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    // Check for SVG element with search icon path
    const svg = screen.getByRole('textbox').parentElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const mockOnChange = vi.fn();
    const { container } = render(
      <SearchBar value="" onChange={mockOnChange} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has proper ARIA label', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByLabelText('Search problems');
    expect(input).toBeInTheDocument();
  });

  it('applies slate styling classes', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('bg-slate-800');
    expect(input).toHaveClass('border-slate-700');
    expect(input).toHaveClass('text-slate-100');
  });
});
