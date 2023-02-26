# testdouble-vitest

[![npm package][npm badge]][npm package]
[![CI Status][ci badge]][ci status]

Use [testdouble.js] with [vitest] for a happier, more productive TDD experience!

This module ties vitest's [import mocking system] together with [td.imitate] to give you a version of [td.replaceEsm] that works in vitest.

[testdouble.js]: https://github.com/testdouble/testdouble.js
[td.imitate]: https://github.com/testdouble/testdouble.js#tdimitate
[td.replaceesm]: https://github.com/testdouble/testdouble.js#tdreplace-and-tdreplaceesm-for-replacing-dependencies
[vitest]: https://vitest.dev
[import mocking system]: https://vitest.dev/guide/mocking.html#modules
[npm package]: https://www.npmjs.com/package/testdouble-vitest
[npm badge]: https://img.shields.io/npm/v/testdouble-vitest?style=flat-square
[ci status]: https://github.com/mcous/testdouble-vitest/actions/workflows/ci.yaml?query=branch%3Amain
[ci badge]: https://img.shields.io/github/actions/workflow/status/mcous/testdouble-vitest/ci.yaml?branch=main&style=flat-square

## Setup

Install vitest, testdouble, and testdouble-vitest using your package manager of choice...

```shell
npm install --save-dev vitest testdouble testdouble-vitest
```

...then configure vitest to inline the testdouble-vitest dependency...

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    deps: {
      inline: ['testdouble-vitest'],
    },
  },
})
```

..and you should be ready to go!

## Recommended usage

Instead of using `td.replaceEsm()` and `td.reset()`, use the `replaceEsm()` and `reset()` functions from testdouble-vitest.

From there, follow recommended testdouble.js usage. Use your `beforeEach()` hook to mock out your test subject's dependencies and import your subject using a dynamic `import()`, then reset in `afterEach()`. See [example] for more details.

```ts
import { vi, describe, beforeEach, afterEach, it } from 'vitest'
import { replaceEsm, reset } from 'testdouble-vitest'
import * as td from 'testdouble'

import type * as dependencyModule from '../dependency'
import type * as subjectModule from '../subject'

describe('collaborator subject', () => {
  let dependency: typeof dependencyModule
  let subject: typeof subjectModule

  beforeEach(async () => {
    dependency = await replaceEsm('../dependency')
    subject = await import('../subject')
  })

  afterEach(() => {
    reset()
  })

  it('should replace the dependency with a testdouble imitation', async () => {
    td.when(dependency.load('abc123')).thenResolve({ id: 'abc123' })

    const result = await subject.getReport('abc123')

    expect(result).to.eql({ id: 'abc123' })
  })
})
```

Like vanilla `td.replaceEsm()`, this module's `replaceEsm()` also allows you to specify the replacement explicitly.

```ts
dependency = await replaceEsm(
  '../dependency',
  { doSomething: td.func('doSomething') }, // named exports object
  td.func('defaultExport') // default export
)
```

[example]: https://github.com/mcous/testdouble-vitest/tree/main/example

## Usage with `vi.mock`

If you prefer to use `vi.mock()` at the top level of your test files, but you would still like to use testdouble.js fakes, you can use this module's `imitateEsm()` function. Compared to the recommended usage, using `vi.mock`:

- Slightly increases the risk of cross-test module state pollution
- Does not differentiate `import` statements for mocked modules and real imports

These tradeoffs might be worth it if you or your team is more comfortable with the typical `jest.mock()` / `vi.mock()` style.

```ts
import { vi, describe, beforeEach, afterEach, it } from 'vitest'
import { imitateEsm, reset } from 'testdouble-vitest'
import * as td from 'testdouble'

import * as dependency from '../dependency'
import * as subject from '../subject'

vi.mock('../dependency', () => imitateEsm('../dependency'))

describe('collaborator subject', () => {
  afterEach(() => {
    reset()
  })

  it('should replace the dependency with a testdouble imitation', async () => {
    td.when(dependency.load('abc123')).thenResolve({ id: 'abc123' })

    const result = await subject.getReport('abc123')

    expect(result).to.eql({ id: 'abc123' })
  })
})
```
