import doSomethindDefault, { doSomething, nested } from './dependency'

export function doSomethingViaDependency(inputValue: string): string {
  return doSomething(inputValue)
}

export function doSomethingDefaultViaDependency(inputValue: string): string {
  return doSomethindDefault(inputValue)
}

export function doSomethingNestedViaDepedency(inputValue: string): string {
  return nested.doSomethingNested(inputValue)
}
