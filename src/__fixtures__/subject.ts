import doSomethingDefault, { doSomething, nested } from './dependency'

export function doSomethingViaDependency(inputValue: string): string {
  return doSomething(inputValue)
}

export function doSomethingDefaultViaDependency(inputValue: string): string {
  return doSomethingDefault(inputValue)
}

export function doSomethingNestedViaDependency(inputValue: string): string {
  return nested.doSomethingNested(inputValue)
}
