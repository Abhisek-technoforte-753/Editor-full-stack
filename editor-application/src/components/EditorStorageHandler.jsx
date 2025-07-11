// SaveLoadControls.jsx
import React from 'react'

const SaveLoadControls = ({ editor }) => {
  // const saveToLocalStorage = async () => {
  //   if (!editor) return

  //   const json = editor.getJSON()

  //   // Save to localStorage
  //   localStorage.setItem('tiptap-doc', JSON.stringify(json))
  //   alert('Document saved to localStorage!')

  //   // Prepare payload
  //   const payload = {
  //     docJson: JSON.stringify(json), // stringify the tiptap JSON
  //     verId: Math.floor(Math.random() * 1000), // random version ID
  //     userId: Math.floor(Math.random() * 10000) // random user ID
  //   }

  //   try {
  //     const response = await fetch('https://localhost:7119/api/ExportWordTipTap/save-doc', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(payload)
  //     })

  //     if (response.ok) {
  //       const result = await response.json()
  //       console.log('Saved to API:', result)
  //     } else {
  //       const error = await response.text()
  //       console.error('API error:', error)
  //       alert('Failed to save to backend.')
  //     }
  //   } catch (error) {
  //     console.error('Request failed:', error)
  //     alert('Network error or server unreachable.')
  //   }
  // }

  const saveToLocalStorage = async () => {
  if (!editor) return

  let json = editor.getJSON()

  // Step 1: Find and process all base64 images in JSON
  const uploadImageAndReplaceSrc = async (json) => {
    if (!json || typeof json !== 'object') return json

    if (json.type === 'image' && json.attrs?.src?.startsWith('data:image')) {
      const base64 = json.attrs.src

      // Upload to backend
      const formData = new FormData()
      formData.append('file', dataURLtoBlob(base64), 'image.png')

      try {
        const res = await fetch('https://localhost:7119/api/ExportWordTipTap/upload', {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          const { imageUrl } = await res.json()
          json.attrs.src = imageUrl // replace with URL
        }
      } catch (err) {
        console.error('Image upload failed', err)
      }
    }

    // Traverse children recursively
    if (Array.isArray(json.content)) {
      json.content = await Promise.all(json.content.map(uploadImageAndReplaceSrc))
    }

    return json
  }

  // Helper to convert base64 → Blob
  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  // Step 2: Process base64 images
  const cleanedJson = await uploadImageAndReplaceSrc(json)

  // Step 3: Save to localStorage
  localStorage.setItem('tiptap-doc', JSON.stringify(cleanedJson))
  alert('Document saved to localStorage!')

  // Step 4: Save to backend
  const payload = {
    docJson: JSON.stringify(cleanedJson),
    verId: Math.floor(Math.random() * 1000),
    userId: Math.floor(Math.random() * 10000),
  }

  try {
    const response = await fetch('https://localhost:7119/api/ExportWordTipTap/save-doc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      const result = await response.json()
      console.log('Saved to API:', result)
    } else {
      const error = await response.text()
      console.error('API error:', error)
      alert('Failed to save to backend.')
    }
  } catch (error) {
    console.error('Request failed:', error)
    alert('Network error or server unreachable.')
  }
}


  return (
    <div>
      <button onClick={saveToLocalStorage} style={{ marginTop: '1rem' }}>
        💾 Save
      </button>
    </div>
  )
}

export default SaveLoadControls
