import { describe, afterEach, it, expect } from 'vitest'
import * as td from 'testdouble'

import { replaceEsm, imitateEsm, reset } from '..'

describe('testdouble-vitest replace', () => {
  afterEach(() => {
    reset()
  })

  it('should replace named exports', async () => {
    const dependency = await replaceEsm('../__fixtures__/dependency')
    const subject = await import('../__fixtures__/subject')

    td.when(dependency.doSomething('hello')).thenReturn('world')

    expect(dependency.SOME_CONSTANT).to.equal(42)
    expect(subject.doSomethingViaDependency('hello')).to.equal('world')
    expect(td.explain(dependency.doSomething).name).to.equal(
      '../__fixtures__/dependency: .doSomething'
    )
  })

  it('should replace default exports', async () => {
    const dependency = await replaceEsm('../__fixtures__/dependency')
    const subject = await import('../__fixtures__/subject')

    td.when(dependency.default('hello')).thenReturn('world')

    expect(subject.doSomethingDefaultViaDependency('hello')).to.equal('world')
    expect(td.explain(dependency.default).name).to.equal(
      '../__fixtures__/dependency: .default'
    )
  })

  it('should replace nested exports', async () => {
    const dependency = await replaceEsm('../__fixtures__/dependency')
    const subject = await import('../__fixtures__/subject')

    td.when(dependency.nested.doSomethingNested('hello')).thenReturn('world')

    expect(subject.doSomethingNestedViaDependency('hello')).to.equal('world')
    expect(td.explain(dependency.nested.doSomethingNested).name).to.equal(
      '../__fixtures__/dependency: .nested.doSomethingNested'
    )
  })

  it('should allow manual named export replacement', async () => {
    const doSomething = td.func('doSomething')
    const replaceResult = await replaceEsm('../__fixtures__/dependency', {
      doSomething,
    })

    const subject = await import('../__fixtures__/subject')

    td.when(doSomething('hello')).thenReturn('world')

    expect(subject.doSomethingViaDependency('hello')).to.equal('world')
    expect(replaceResult).to.equal(undefined)
  })

  it('should allow manual default export replacement', async () => {
    const doSomethingDefault = td.func('doSomethingDefault')
    const replaceResult = await replaceEsm(
      '../__fixtures__/dependency',
      undefined,
      doSomethingDefault
    )

    const subject = await import('../__fixtures__/subject')

    td.when(doSomethingDefault('hello')).thenReturn('world')

    expect(subject.doSomethingDefaultViaDependency('hello')).to.equal('world')
    expect(replaceResult).to.equal(undefined)
  })

  it('should reset module mocks', async () => {
    await replaceEsm('../__fixtures__/dependency')

    reset()

    const subject = await import('../__fixtures__/subject')
    const dependency = await import('../__fixtures__/dependency')

    expect(() => subject.doSomethingViaDependency('hello')).to.throw(
      /not implemented/
    )
    expect(() => dependency.doSomething('hello')).to.throw(/not implemented/)
  })

  it('should imitate a module by path without mocking the import', async () => {
    const imitatedDependency = await imitateEsm('../__fixtures__/dependency')
    const actualDependency = await import('../__fixtures__/dependency')

    td.when(imitatedDependency.doSomething('hello')).thenReturn('world')

    expect(imitatedDependency.doSomething('hello')).to.equal('world')
    expect(() => actualDependency.doSomething('hello')).to.throw(
      /not implemented/
    )
  })
})
