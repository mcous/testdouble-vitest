import * as td from 'testdouble'
import { replaceEsm, reset } from 'testdouble-vitest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type * as reportGeneratorModule from './generate-report'
import type * as subjectModule from './get-report'
import type * as dataLoaderModule from './load-report-data'

describe('getting a report', () => {
  let dataLoader: typeof dataLoaderModule
  let reportGenerator: typeof reportGeneratorModule
  let subject: typeof subjectModule

  beforeEach(async () => {
    dataLoader = await replaceEsm('./load-report-data')
    reportGenerator = await replaceEsm('./generate-report')
    subject = await import('./get-report')
  })

  afterEach(() => {
    reset()
  })

  it('should load the data and generate the report', async () => {
    const reportData = { id: 'abc123' }
    const report = { id: 'abc123', summary: 'hello world' }

    td.when(dataLoader.loadReportData('abc123')).thenResolve(reportData)
    td.when(reportGenerator.generateReport(reportData)).thenReturn(report)

    const result = await subject.getReport('abc123')

    expect(result).to.eql(report)
  })
})
