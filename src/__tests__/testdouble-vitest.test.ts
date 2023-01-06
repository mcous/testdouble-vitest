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
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
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
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
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
    const imitated = await imitateEsm('../__fixtures__/dependency')
    const actual = await import('../__fixtures__/dependency')

    td.when(imitated.doSomething('hello')).thenReturn('world')

    expect(imitated.doSomething('hello')).to.equal('world')
    expect(() => actual.doSomething('hello')).to.throw(/not implemented/)
  })

  it('should imitate circular dependencies', async () => {
    const imitated = await imitateEsm('../__fixtures__/circular-dependency-a')

    td.when(imitated.doA()).thenReturn(42)
    td.when(imitated.b.doB()).thenReturn(84)

    expect(imitated.doA()).to.equal(42)
    expect(imitated.b.doB()).to.equal(84)
  })
})
