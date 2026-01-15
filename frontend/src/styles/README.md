# LocalCode Editor Theme

This directory contains the Monaco Editor theme configuration for LocalCode.

## Usage

### Basic Setup

```jsx
import { Editor } from '@monaco-editor/react';
import { defineLocalcodeTheme } from './styles/editor-theme';

function CodeEditor() {
  const handleEditorWillMount = (monaco) => {
    // Define the custom theme before the editor mounts
    defineLocalcodeTheme(monaco);
  };

  return (
    <Editor
      height="500px"
      defaultLanguage="javascript"
      defaultValue="// Write your code here"
      theme="localcode-dark"
      beforeMount={handleEditorWillMount}
      options={{
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Fira Code, Monaco, monospace',
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
}
```

### Theme Colors

The `localcode-dark` theme uses the following color scheme:

- **Background**: Slate-850 (#1e293b)
- **Foreground**: Slate-200 (#e2e8f0)
- **Keywords**: Amber-400 (#fbbf24)
- **Strings**: Emerald-500 (#10b981)
- **Numbers**: Amber-500 (#f59e0b)
- **Functions**: Blue-400 (#60a5fa)
- **Types/Classes**: Purple-400 (#a78bfa)
- **Comments**: Gray-500 (#6b7280) italic
- **Cursor**: Amber-400 (#fbbf24)
- **Selection**: Amber-500 with opacity

### Supported Languages

The theme provides syntax highlighting for:
- JavaScript/TypeScript
- Java
- Python
- HTML/XML
- CSS
- JSON

### Customization

To modify the theme, edit `editor-theme.js` and update:
- `rules`: Token colors for syntax highlighting
- `colors`: Editor UI colors (background, selection, cursor, etc.)

The theme inherits from Monaco's built-in `vs-dark` theme, so all standard features are supported.
