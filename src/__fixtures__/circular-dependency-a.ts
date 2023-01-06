export * as b from './circular-dependency-b'

export function doA(): number {
  throw new Error('Not implemented')
}
