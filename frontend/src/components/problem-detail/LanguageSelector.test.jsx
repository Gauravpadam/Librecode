import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageSelector from './LanguageSelector';

describe('LanguageSelector', () => {
  it('renders language selector dropdown', () => {
    render(<LanguageSelector />);
    expect(screen.getByLabelText(/select programming language/i)).toBeInTheDocument();
  });

  it('displays all three language options', () => {
    render(<LanguageSelector />);
    const select = screen.getByLabelText(/select programming language/i);
    
    expect(select).toBeInTheDocument();
    const options = Array.from(select.options).map(opt => opt.value);
    expect(options).toEqual(['java', 'python', 'javascript']);
  });

  it('shows selected language', () => {
    render(<LanguageSelector selectedLanguage="python" />);
    const select = screen.getByLabelText(/select programming language/i);
    expect(select.value).toBe('python');
  });

  it('defaults to JavaScript', () => {
    render(<LanguageSelector />);
    const select = screen.getByLabelText(/select programming language/i);
    expect(select.value).toBe('javascript');
  });

  it('calls onLanguageChange when language is changed', () => {
    const handleChange = vi.fn();
    render(<LanguageSelector selectedLanguage="javascript" onLanguageChange={handleChange} />);
    
    const select = screen.getByLabelText(/select programming language/i);
    fireEvent.change(select, { target: { value: 'java' } });
    
    expect(handleChange).toHaveBeenCalledWith('java');
  });

  it('displays language labels with icons', () => {
    render(<LanguageSelector />);
    const select = screen.getByLabelText(/select programming language/i);
    const optionTexts = Array.from(select.options).map(opt => opt.textContent);
    
    expect(optionTexts).toContain('☕ Java');
    expect(optionTexts).toContain('🐍 Python');
    expect(optionTexts).toContain('⚡ JavaScript');
  });

  it('applies custom className', () => {
    const { container } = render(<LanguageSelector className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
