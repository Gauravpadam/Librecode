import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CodeEditor from './CodeEditor';

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ loading, language, value }) => (
    <div data-testid="monaco-editor" data-language={language} data-value={value}>
      {loading || 'Monaco Editor'}
    </div>
  ),
}));

describe('CodeEditor', () => {
  it('renders Monaco editor', () => {
    render(<CodeEditor value="console.log('test');" />);
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<CodeEditor value="" />);
    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toBeInTheDocument();
  });

  it('passes correct language to Monaco', () => {
    render(<CodeEditor language="python" value="print('test')" />);
    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toHaveAttribute('data-language', 'python');
  });

  it('passes value to Monaco', () => {
    const code = 'function test() { return true; }';
    render(<CodeEditor language="javascript" value={code} />);
    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toHaveAttribute('data-value', code);
  });

  it('supports Java language', () => {
    render(<CodeEditor language="java" value="public class Test {}" />);
    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toHaveAttribute('data-language', 'java');
  });

  it('defaults to JavaScript if no language specified', () => {
    render(<CodeEditor value="const x = 1;" />);
    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toHaveAttribute('data-language', 'javascript');
  });
});
