import React from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const ExportToPdf = () => {
 

  const exportPDF = async () => {
  const input = document.getElementById('editor-page')
  if (!input) return

  // Save original height
  const originalHeight = input.style.height

  // Expand to fit content
  input.style.height = input.scrollHeight + 'px'

  // Capture as image
  const canvas = await html2canvas(input, {
    allowTaint: true,
    useCORS: true,
    scale: 2,
    windowWidth: input.scrollWidth,
    windowHeight: input.scrollHeight,
  })

  // Restore original height
  input.style.height = originalHeight

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const imgProps = pdf.getImageProperties(imgData)
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

  // Handle multi-page if content exceeds one page
  const pageHeight = pdf.internal.pageSize.getHeight()
  let position = 0

  while (position < pdfHeight) {
    pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, pdfHeight)
    if (position + pageHeight < pdfHeight) {
      pdf.addPage()
    }
    position += pageHeight
  }

  pdf.save('editor-content.pdf')
}


  return (
    <button onClick={exportPDF} style={{ marginTop: '1rem' }}>
      Export to PDF
    </button>
  )
}

export default ExportToPdf
