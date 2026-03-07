import type { ReportFormat } from './report.types'

const MIME_MAP: Record<ReportFormat, string> = {
  pdf:  'application/pdf',
  csv:  'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export async function downloadReportBlob(blob: Blob, title: string, format: ReportFormat): Promise<void> {
  if (blob.type === 'application/json') {
    const text = await blob.text()
    const json = JSON.parse(text)
    throw new Error(json.message ?? 'Download failed')
  }

  const url  = URL.createObjectURL(new Blob([blob], { type: MIME_MAP[format] ?? 'application/octet-stream' }))
  const link = document.createElement('a')
  link.href     = url
  link.download = `${title}.${format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
