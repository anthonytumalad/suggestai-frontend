export function downloadBlob(blob: Blob, type: 'csv' | 'xlsx' | 'pdf'): void {
  const mime = {
    pdf: 'application/pdf',
    csv: 'text/csv',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }[type]

  const url = URL.createObjectURL(new Blob([blob], { type: mime }))
  const link = document.createElement('a')
  link.href = url
  link.download = `suggestions.${type}`
  link.click()
  URL.revokeObjectURL(url)
}
