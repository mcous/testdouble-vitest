export interface ReportData {
  id: string
}

export async function loadReportData(id: string): Promise<ReportData> {
  throw new Error(`loadReportData(${id}) not implemented`)
}
