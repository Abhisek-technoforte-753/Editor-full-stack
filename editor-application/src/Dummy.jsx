// ExportToWordDoc.jsx
import React, { useEffect, useState } from 'react'

const ExportToWordDoc = ({ editor }) => {
  const [loading, setLoading] = useState(false)

 const handleExport = async () => {
  const json = editor.getJSON();
  setLoading(true);

  try {
    const response = await fetch('https://localhost:7119/api/ExportWordTipTap/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    });

    if (!response.ok) {
      throw new Error('Failed to generate Word document');
    }
     console.log('Response:', response);
    const blob = await response.blob(); // ✅ This is correct
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'TipTapContent.docx';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export to Word error:', error);
    alert('Something went wrong while exporting to Word.');
  } finally {
    setLoading(false);
  }
};


  const fetchData=()=>{
    fetch('https://localhost:7119/api/ExportWordTipTap/dummy')
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched:', data)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <button onClick={handleExport} disabled={loading}>
      {loading ? 'Exporting...' : 'Export to Word'}
    </button>
  )
}

export default ExportToWordDoc
