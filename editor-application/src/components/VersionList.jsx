import React, { useEffect, useState } from 'react'
import htmlDocx from 'html-docx-js/dist/html-docx'
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Image from '@tiptap/extension-image'

const VersionList = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://localhost:7119/api/ExportWordTipTap/get-all')
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load documents:', err)
        setLoading(false)
      })
  }, [])



const downloadDocx = async (docJson) => {
  try {
    const json = typeof docJson === 'string' ? JSON.parse(docJson) : docJson

    // Convert Tiptap JSON to HTML string
    const htmlString = generateHTML(json, [
      StarterKit,
      Table,
      TableRow,
      TableHeader,
      TableCell,
      Image,
    ])

    // Create temp DOM to resolve and inline image base64
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlString

    const images = tempDiv.querySelectorAll('img')

    await Promise.all(
      Array.from(images).map(async (img) => {
        const src = img.getAttribute('src')
        if (src && !src.startsWith('data:')) {
          const blob = await fetch(src).then(res => res.blob())
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.readAsDataURL(blob)
          })
          img.setAttribute('src', base64)
        }
      })
    )

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; }
            table, th, td {
              border: 1px solid black;
              border-collapse: collapse;
              padding: 6px;
            }
            img {
              max-width: 500px;
              max-height: 400px;
              display: block;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>${tempDiv.innerHTML}</body>
      </html>
    `

    const blob = htmlDocx.asBlob(html)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'Document.docx'
    a.click()
  } catch (err) {
    console.error('Error exporting document:', err)
    alert('Failed to download Word document.')
  }
}


  if (loading) return <p>Loading saved documents...</p>

  return (
    <div>
      <h3>📄 Saved Documents</h3>
      {documents.length === 0 ? (
        <p>No saved versions found.</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc.id} style={{ marginBottom: '1rem' }}>
              <div>
                <strong>Version ID:</strong> {doc.verId} | <strong>User:</strong> {doc.userId}
              </div>
              <button onClick={() => downloadDocx(doc.docJson)}>⬇️ Download (Frontend)</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default VersionList
