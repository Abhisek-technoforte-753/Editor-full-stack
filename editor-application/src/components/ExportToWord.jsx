// ExportToWord.jsx
import React from 'react'
import htmlDocx from 'html-docx-js/dist/html-docx'

const ExportToWord = ({ editor }) => {
  const exportWord = () => {
      const editorElement = document.getElementById('editor-page')
  const cloned = editorElement.cloneNode(true)
     const images = cloned.querySelectorAll('img')
  images.forEach((img) => {
    img.setAttribute('width', '600') // or 100% if inside a fixed-width wrapper
    img.removeAttribute('style') // optional: remove inline styles to avoid conflict
  })
    const html = document.getElementById('editor-page').innerHTML
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial; }
            .shape-drag-handle { position: absolute; }
                 img {
          max-width: 600px; /* or use percentage like 100% */
          max-height: 400px;
          width: 2px;
          height: 2px;
          object-fit: contain;
          display: block;
          margin: 10px 0;
        }
            /* Word-compatible table borders */
            table, th, td {
              border: 1px solid black;
              border-collapse: collapse;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
              
          </style>
        </head>
        <body>${html}</body>
      </html>
    `
    const blob = htmlDocx.asBlob(content)
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'document.docx'
    link.click()
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <button onClick={exportWord}>Export to Word</button>
    </div>
  )
}

export default ExportToWord
