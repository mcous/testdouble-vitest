# Contributing Guide

## Issues and pull requests

Got a question, comment, or problem? File an [issue]!

[Pull requests] are also appreciated, but please open an issue before submitting a pull request so we can provide guidance ahead of time.

[issue]: https://github.com/mcous/testdouble-vitest/issues
[pull requests]: https://github.com/mcous/testdouble-vitest/pulls

## Development setup

To get started, ensure [Node.js] v16 and [pnpm] v7 (or later) are installed on your machine. Then, clone the repository and install development dependencies.

```shell
git clone https://github.com/mcous/testdouble-vitest.git
cd testdouble-vitest
pnpm install
```

[node.js]: https://nodejs.org
[pnpm]: https://pnpm.io/

## Development scripts

We use [package.json](./package.json) scripts to define various development tasks.

### Check everything

Want to make sure absolutely everything works? Use the `all` script to run all tests, checks, and builds.

```shell
pnpm all
```

### Run tests

Use the `test` script to run tests in watch mode, or the `test:once` script to run the test suite once.

```shell
pnpm test
pnpm test:once
```

### Code formatting and linting

Use `format` to ensure all your code adheres to the correct style, and `lint` to run code quality checks.

```shell
pnpm format
pnpm lint
```

### Build production assets

We build two types of production assets:

- Package bundles
- Type definitions

You can use the `build` script to build these assets, and the `clean` script to remove them.

```shell
pnpm build
```

## Publishing

This module will be published automatically to [npm] on pushed tags. Use the [npm version] command to bump the version, then push the commit and tag up to `origin`.

```shell
npm version patch -m 'chore(release): %s'
git push origin --follow-tags
```

[npm]: https://www.npmjs.com/
[npm version]: https://docs.npmjs.com/cli/v9/commands/npm-version
