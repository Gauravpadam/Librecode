/**
 * LocalCode Dark Theme for Monaco Editor
 * Updated with new color palette: #22223b (background), #c9ada7 (primary), #f2e9e4 (text)
 */

export const localcodeDarkTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    // Comments
    { token: 'comment', foreground: '9a8c98', fontStyle: 'italic' },
    { token: 'comment.line', foreground: '9a8c98', fontStyle: 'italic' },
    { token: 'comment.block', foreground: '9a8c98', fontStyle: 'italic' },
    
    // Keywords
    { token: 'keyword', foreground: 'c9ada7' }, // primary
    { token: 'keyword.control', foreground: 'c9ada7' },
    { token: 'keyword.operator', foreground: 'd9bdb7' }, // light primary
    
    // Strings
    { token: 'string', foreground: '10b981' }, // emerald-500
    { token: 'string.escape', foreground: '34d399' }, // emerald-400
    
    // Numbers
    { token: 'number', foreground: 'c9ada7' }, // primary
    { token: 'number.hex', foreground: 'c9ada7' },
    { token: 'number.float', foreground: 'c9ada7' },
    
    // Functions
    { token: 'function', foreground: 'd9bdb7' }, // light primary
    { token: 'identifier.function', foreground: 'd9bdb7' },
    
    // Types and Classes
    { token: 'type', foreground: '9a8c98' }, // accent1
    { token: 'type.identifier', foreground: '9a8c98' },
    { token: 'class', foreground: '9a8c98' },
    { token: 'class.identifier', foreground: '9a8c98' },
    
    // Variables
    { token: 'variable', foreground: 'f2e9e4' }, // text
    { token: 'variable.parameter', foreground: 'e2d9d4' }, // secondary text
    
    // Operators
    { token: 'operator', foreground: 'c9ada7' }, // primary
    { token: 'delimiter', foreground: '9a8c98' }, // accent1
    
    // Tags (for HTML/XML)
    { token: 'tag', foreground: 'c9ada7' },
    { token: 'tag.id', foreground: 'd9bdb7' },
    { token: 'tag.class', foreground: '9a8c98' },
    
    // Attributes
    { token: 'attribute.name', foreground: 'd9bdb7' },
    { token: 'attribute.value', foreground: '10b981' },
    
    // Constants
    { token: 'constant', foreground: 'c9ada7' },
    { token: 'constant.language', foreground: 'd9bdb7' },
    
    // Annotations (Java)
    { token: 'annotation', foreground: 'c9ada7' },
    { token: 'meta.annotation', foreground: 'c9ada7' },
  ],
  colors: {
    // Editor background and foreground
    'editor.background': '#22223b', // background
    'editor.foreground': '#f2e9e4', // text
    
    // Line highlighting
    'editor.lineHighlightBackground': '#4a4e69', // accent2
    'editor.lineHighlightBorder': '#4a4e69',
    
    // Selection
    'editor.selectionBackground': '#c9ada733', // primary with opacity
    'editor.selectionHighlightBackground': '#c9ada722',
    'editor.inactiveSelectionBackground': '#c9ada722',
    
    // Cursor
    'editorCursor.foreground': '#c9ada7', // primary
    
    // Line numbers
    'editorLineNumber.foreground': '#9a8c98', // accent1
    'editorLineNumber.activeForeground': '#c9ada7', // primary
    
    // Gutter
    'editorGutter.background': '#22223b',
    
    // Whitespace
    'editorWhitespace.foreground': '#4a4e69', // accent2
    
    // Indentation guides
    'editorIndentGuide.background': '#4a4e69',
    'editorIndentGuide.activeBackground': '#9a8c98',
    
    // Brackets
    'editorBracketMatch.background': '#c9ada733',
    'editorBracketMatch.border': '#c9ada7',
    
    // Scrollbar
    'scrollbar.shadow': '#00000033',
    'scrollbarSlider.background': '#9a8c9880',
    'scrollbarSlider.hoverBackground': '#9a8c98cc',
    'scrollbarSlider.activeBackground': '#c9ada7',
    
    // Minimap
    'minimap.background': '#22223b',
    'minimap.selectionHighlight': '#c9ada733',
    
    // Find/Replace widget
    'editorWidget.background': '#4a4e69', // accent2
    'editorWidget.border': '#9a8c98',
    'editorWidget.foreground': '#f2e9e4',
    
    // Suggest widget (autocomplete)
    'editorSuggestWidget.background': '#4a4e69',
    'editorSuggestWidget.border': '#9a8c98',
    'editorSuggestWidget.foreground': '#f2e9e4',
    'editorSuggestWidget.selectedBackground': '#22223b',
    'editorSuggestWidget.highlightForeground': '#c9ada7',
    
    // Hover widget
    'editorHoverWidget.background': '#4a4e69',
    'editorHoverWidget.border': '#9a8c98',
    
    // Peek view (definition preview)
    'peekView.border': '#c9ada7',
    'peekViewEditor.background': '#22223b',
    'peekViewResult.background': '#4a4e69',
    'peekViewTitle.background': '#4a4e69',
    
    // Error/Warning squiggles
    'editorError.foreground': '#ef4444', // red-500
    'editorWarning.foreground': '#c9ada7', // primary
    'editorInfo.foreground': '#9a8c98', // accent1
  }
};

/**
 * Define the Monaco theme
 * Call this function before mounting the Monaco Editor
 * 
 * @param {object} monaco - Monaco editor instance
 */
export function defineLocalcodeTheme(monaco) {
  monaco.editor.defineTheme('localcode-dark', localcodeDarkTheme);
}
