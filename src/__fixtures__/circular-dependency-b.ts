export * as a from './circular-dependency-a'

export function doB(): number {
  throw new Error('Not implemented')
}
