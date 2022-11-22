import { loadReportData } from './load-report-data'
import { generateReport } from './generate-report'

import type { Report } from './generate-report'

export async function getReport(id: string): Promise<Report> {
  const data = await loadReportData(id)
  const report = generateReport(data)

  return report
}
