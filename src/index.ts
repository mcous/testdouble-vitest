import { vi } from 'vitest'
import * as td from 'testdouble'

const needsUnmock = new Set<string>()
let quibbleInitialized = false

export async function replaceEsm<
  ModuleType = { default?: any; [exportName: string]: any },
>(path: string): Promise<ModuleType>

export async function replaceEsm(
  path: string,
  namedExportStubs?: Record<string, any>,
  defaultExportStub?: any
): Promise<void>

export async function replaceEsm(
  path: string,
  namedExportStubs?: Record<string, any>,
  defaultExportStub?: any
): Promise<any> {
  const absolutePath = getAbsoluteModulePath(path)
  let imitation: any
  let replacement: any

  if (namedExportStubs === undefined && defaultExportStub === undefined) {
    imitation = await imitateModuleByPath(absolutePath, getNameForFake(path))
    replacement = imitation
  } else {
    replacement = { default: defaultExportStub, ...namedExportStubs }
  }

  vi.doMock(absolutePath, () => replacement)
  needsUnmock.add(absolutePath)

  return imitation
}

export function reset(): void {
  const needsModuleReset = needsUnmock.size > 0

  for (const moduleName of needsUnmock) {
    vi.doUnmock(moduleName)
    needsUnmock.delete(moduleName)
  }

  if (needsModuleReset) {
    vi.resetModules()
  }

  td.reset()
}

export async function imitateEsm(path: string): Promise<any> {
  const absolutePath = getAbsoluteModulePath(path)
  const fakeName = getNameForFake(path)
  const replacement = await imitateModuleByPath(absolutePath, fakeName)

  return replacement
}

function getNameForFake(path: string): string {
  return `${path}: `
}

function getAbsoluteModulePath(path: string): string {
  if (!quibbleInitialized) {
    td.quibble.ignoreCallsFromThisFile()
    quibbleInitialized = true
  }

  return td.quibble.absolutify(path)
}

async function imitateModuleByPath(
  absolutePath: string,
  name: string
): Promise<any> {
  const actualProxy: any = await vi.importActual(absolutePath)
  const spec = unwrapModuleProxy(actualProxy)

  return td.imitate<any>(spec, name)
}

function unwrapModuleProxy(
  object: unknown,
  unwrappedObjects = new Map<object, any>()
): any {
  if (
    typeof object === 'object' &&
    object !== null &&
    Symbol.toStringTag in object &&
    object[Symbol.toStringTag] === 'Module'
  ) {
    let unwrapped = unwrappedObjects.get(object)

    if (unwrapped === undefined) {
      unwrapped = Object.create(null)
      unwrappedObjects.set(object, unwrapped)

      const properties = Object.getOwnPropertyDescriptors(object)

      for (const [name, descriptor] of Object.entries(properties)) {
        const value =
          typeof descriptor.get === 'function'
            ? descriptor.get()
            : descriptor.value

        unwrapped[name] = unwrapModuleProxy(value, unwrappedObjects)
      }
    }

    return unwrapped
  }

  return object
}

// typing additions / corrections for testdouble
declare module 'testdouble' {
  // add `name` to Explanation interface
  export interface Explanation {
    name: string | null
  }

  // partial quibble API
  interface Quibble {
    ignoreCallsFromThisFile: () => void
    absolutify: (moduleName: string) => string
  }

  // add `quibble` export
  export const quibble: Quibble
}
