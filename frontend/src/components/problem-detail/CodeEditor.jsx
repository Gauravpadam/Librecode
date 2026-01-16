import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Editor from '@monaco-editor/react';
import { defineLocalcodeTheme } from '../../styles/editor-theme';

/**
 * CodeEditor component with Monaco Editor integration
 * Supports Java, Python, and JavaScript with syntax highlighting
 */
function CodeEditor({ 
  language = 'javascript', 
  value = '', 
  onChange,
  height = '100%',
  readOnly = false,
  className = ''
}) {
  const editorRef = useRef(null);

  // Handle editor mount
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    
    // Define and apply custom theme
    defineLocalcodeTheme(monaco);
    monaco.editor.setTheme('localcode-dark');
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Fira Code, Monaco, monospace',
      lineHeight: 1.6,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: language === 'python' ? 4 : 2,
      insertSpaces: true,
      wordWrap: 'off',
      readOnly: readOnly,
    });
  }

  // Handle editor value change with debouncing
  function handleEditorChange(newValue) {
    if (onChange) {
      onChange(newValue);
    }
  }

  // Map language names to Monaco language identifiers
  const getMonacoLanguage = (lang) => {
    const languageMap = {
      'java': 'java',
      'python': 'python',
      'javascript': 'javascript',
      'js': 'javascript',
    };
    return languageMap[lang.toLowerCase()] || 'javascript';
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="localcode-dark"
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          cursorStyle: 'line',
          automaticLayout: true,
        }}
        loading={
          <div className="flex items-center justify-center h-full bg-background">
            <div className="text-textLight">Loading editor...</div>
          </div>
        }
      />
    </div>
  );
}

CodeEditor.propTypes = {
  language: PropTypes.oneOf(['java', 'python', 'javascript', 'js']),
  value: PropTypes.string,
  onChange: PropTypes.func,
  height: PropTypes.string,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
};

export default CodeEditor;
