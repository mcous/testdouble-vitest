export const SOME_CONSTANT = 42

export function doSomething(inputValue: string): string {
  throw new Error(`doSomething(${inputValue}) not implemented`)
}

export default function doSomethingDefault(inputValue: string): string {
  throw new Error(`doSomethingDefault(${inputValue}) not implemented`)
}

export * as nested from './nested-dependency'
