import {Editor, loader} from '@monaco-editor/react';
import type {EditorProps, OnChange, OnMount} from '@monaco-editor/react';

// Loading from a CDN to avoid having to setup specific Webpack configuration
// which doesn't play well (especially with Storybook).
// See https://www.npmjs.com/package/@monaco-editor/loader#configure-the-loader-to-load-the-monaco-as-an-npm-package
// if we ever want to switch to the NPM module instead.
loader.config({paths: {vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.48.0/min/vs'}});

interface JSONEditorProps {
  value?: any;
  onChange: (value: any) => void;
  readOnly?: boolean;
  showLines?: boolean;
}

type AvailableEditorProps = Pick<EditorProps, 'height'>;

const JSONEditor: React.FC<JSONEditorProps & AvailableEditorProps> = ({
  value = '',
  onChange,
  readOnly = false,
  showLines = true,
  ...props
}) => {
  const monacoOnChange: OnChange = value => {
    if (value != undefined) {
      let updatedData: any;

      try {
        updatedData = JSON.parse(value);
      } catch {
        return;
      }

      onChange(updatedData);
    }
  };

  const monacoOnMount: OnMount = (_, monaco) => {
    // Disable schema autocompletions, they aren't relevant
    monaco.languages.json.jsonDefaults.setModeConfiguration({
      ...monaco.languages.json.jsonDefaults.modeConfiguration,
      completionItems: false,
    });
  };

  const jsonData = JSON.stringify(value, null, 2);

  const extraOptions: EditorProps['options'] = {readOnly};
  if (!showLines) extraOptions.lineNumbers = 'off';

  return (
    <Editor
      language="json"
      options={{
        minimap: {enabled: false},
        contextmenu: false,
        renderWhitespace: 'trailing',
        ...extraOptions,
      }}
      value={jsonData}
      onChange={monacoOnChange}
      onMount={monacoOnMount}
      {...props}
    />
  );
};

export default JSONEditor;
