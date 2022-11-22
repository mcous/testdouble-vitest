import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { replaceEsm, reset } from 'testdouble-vitest'
import * as td from 'testdouble'

describe('getting a report', () => {
  let dataLoader: typeof import('./load-report-data')
  let reportGenerator: typeof import('./generate-report')
  let subject: typeof import('./get-report')

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
