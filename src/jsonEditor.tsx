import * as monaco from 'monaco-editor/editor';
import {loader, Editor} from '@monaco-editor/react';
import type {EditorProps, OnChange, OnMount} from '@monaco-editor/react';
// See https://github.com/microsoft/monaco-editor/issues/5346#issuecomment-5277354356
// for the confusing imports w/r to bundlers...
import 'monaco-editor/features/register.all';
import * as json from 'monaco-editor/languages/features/json/register';
import EditorWorker from 'monaco-editor/editor/editor.worker?worker&inline';
import JsonWorker from 'monaco-editor/languages/features/json/json.worker?worker&inline';
import {useRef} from 'react';

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new JsonWorker();
    }
    return new EditorWorker();
  },
};

loader.config({monaco});

export interface JSONEditorProps {
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
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

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

  const monacoOnMount: OnMount = (editor, _) => {
    editorRef.current = editor;
    _updateLineCount();

    // Disable schema autocompletions, they aren't relevant
    json.jsonDefaults.setModeConfiguration({
      ...json.jsonDefaults.modeConfiguration,
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
