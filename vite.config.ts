/// <reference types="vitest/config" />
import {resolve} from 'node:path';

import {storybookTest} from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import {playwright} from '@vitest/browser-playwright';
import dts from 'unplugin-dts/vite';
import {defineConfig} from 'vite';

import {peerDependencies} from './package.json' with {type: 'json'};

// We deliberately do not externalize direct dependencies to make this library properly
// self-contained.
const externalPackages = [...Object.keys(peerDependencies || {})];

// Creating regexes of the packages to make sure subpaths of the
// packages are also treated as external
const packageRegexes = externalPackages.map(packageName => new RegExp(`^${packageName}(/.*)?`));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dts({tsconfigPath: 'tsconfig.prod.json', bundleTypes: true})],
  base: './',
  resolve: {
    tsconfigPaths: true,
  },
  // actually bundle the library so that everything is self-contained, but don't bundle
  // peer dependencies
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rolldownOptions: {
      external: packageRegexes,
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: resolve(import.meta.dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
});
