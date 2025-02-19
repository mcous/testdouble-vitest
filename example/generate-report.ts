import type { ReportData } from './load-report-data'

export interface Report {
  id: string
  summary: string
}

export function generateReport(data: ReportData): Report {
  throw new Error(`generateReport(${JSON.stringify(data)}) not implemented`)
}
