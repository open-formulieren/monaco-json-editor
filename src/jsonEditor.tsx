import {useRef} from 'react';
import {Editor, loader} from '@monaco-editor/react';
import type {EditorProps, OnChange, OnMount} from '@monaco-editor/react';
import {editor} from 'monaco-editor';

// Loading from a CDN to avoid having to setup specific Webpack configuration
// which doesn't play well (especially with Storybook).
// See https://www.npmjs.com/package/@monaco-editor/loader#configure-the-loader-to-load-the-monaco-as-an-npm-package
// if we ever want to switch to the NPM module instead.
loader.config({paths: {vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs'}});

interface JSONEditorProps {
  value?: any;
  onChange: (value: any) => void;
  onRawChange?: (code: string) => void;
  lineCountCallback?: (numLines: number | undefined) => void;
  readOnly?: boolean;
  showLines?: boolean;
  tabSize?: number;
  theme?: 'light' | 'dark';
}

type AvailableEditorProps = Pick<EditorProps, 'height' | 'wrapperProps'>;

export const JSONEditor: React.FC<JSONEditorProps & AvailableEditorProps> = ({
  value,
  onChange,
  onRawChange,
  lineCountCallback,
  readOnly = false,
  showLines = true,
  tabSize = 2,
  theme = 'light',
  ...props
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const _updateLineCount = () => {
    const editor = editorRef.current;
    lineCountCallback?.(editor?.getModel()?.getLineCount());
  };

  const monacoOnChange: OnChange = value => {
    _updateLineCount();

    if (value != undefined) {
      onRawChange?.(value);

      let updatedData: any;
      try {
        updatedData = JSON.parse(value);
      } catch {
        return;
      }

      onChange(updatedData);
    }
  };

  const monacoOnMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    _updateLineCount();

    // Disable schema autocompletions, they aren't relevant
    monaco.languages.json.jsonDefaults.setModeConfiguration({
      ...monaco.languages.json.jsonDefaults.modeConfiguration,
      completionItems: false,
    });
  };

  return (
    <Editor
      language="json"
      options={{
        minimap: {enabled: false},
        contextmenu: false,
        renderWhitespace: 'trailing',
        readOnly,
        tabSize,
        lineNumbers: showLines ? 'on' : 'off',
      }}
      value={value !== undefined ? JSON.stringify(value, null, 2) : undefined}
      onChange={monacoOnChange}
      onMount={monacoOnMount}
      theme={theme === 'dark' ? 'vs-dark' : 'light'}
      {...props}
    />
  );
};
