import type {Meta, StoryObj} from '@storybook/react-vite';
import {fn} from 'storybook/test';

import {JSONEditor} from './jsonEditor';

export default {
  title: 'Public API / JSONEditor',
  component: JSONEditor,
  decorators: [
    Story => (
      <div style={{blockSize: '100dvh', inlineSize: '100dvw'}}>
        <Story />
      </div>
    ),
  ],
  args: {
    value: {some: 'json'},
    onChange: fn(),
    onRawChange: fn(),
    lineCountCallback: fn(),
    readOnly: false,
    showLines: true,
    tabSize: 2,
    theme: 'light',
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof JSONEditor>;

type Story = StoryObj<typeof JSONEditor>;

export const Default: Story = {};
