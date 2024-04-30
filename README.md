# Monaco JSON Editor

A JSON editor using the Monaco editor.

Provides a `JSONEditor` component wrapping the [Monaco editor](https://github.com/suren-atoyan/monaco-react) with sane defaults.

[![Run CI build and tests](https://github.com/open-formulieren/monaco-json-editor/actions/workflows/ci.yml/badge.svg)](https://github.com/open-formulieren/monaco-json-editor/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/%40open-formulieren%2Fmonaco-json-editor)](https://www.npmjs.com/package/@open-formulieren/monaco-json-editor)

## Contributing

Contributions that do not provide a direct benefit to the Open Forms project will unfortunately be
rejected, as we do not have the ambition nor resources to maintain these.

For (code) contributions that do fit the goals of this library, please follow these guidelines:

- Create an issue with a description of the problem or required feature
- Reference the issue ID in commit messages and pull requests
- Functionality must be documented in Storybook
- Functionality must be covered by tests - Jest (unit/integration) tests and/or Storybook
  interaction tests

## Getting started

1. Clone the repository and then ensure you use the correct node version:

```bash
nvm use
```

2. Start Storybook in dev mode for component development:

```bash
npm start
```

3. Make code changes, check in Storybook, add tests... etc.

4. Run the tests (Storybook needs to be running still!)

```bash
npm test
```

5. Check that the (Typescript) build compiles cleanly:

```bash
npm run build:esm
```

Additional NPM scripts can be found in `package.json`.
