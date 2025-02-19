import type { Report } from './generate-report'
import { generateReport } from './generate-report'
import { loadReportData } from './load-report-data'

export async function getReport(id: string): Promise<Report> {
  const data = await loadReportData(id)
  const report = generateReport(data)

  return report
}
