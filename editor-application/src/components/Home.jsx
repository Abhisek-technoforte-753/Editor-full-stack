import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DocumentForm from './DocumentForm';
import Tiptap from './Tiptap';
import UniverEditorExcel from './UniverEditorExcel';
import './Home.css';

const Home = () => {
  const [editorInstance, setEditorInstance] = useState(null);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [editorType, setEditorType] = useState('word'); // 'word' or 'excel'
  const [formData, setFormData] = useState({
    title: '',
    docType: 'Word',
    location: '',
    department: '',
    section: '',
    subSection: '',
    status: 'Draft',
    isLegalRequired: false,
    isGoldenRule: false,
    kpi: '',
    konzernMapping: '',
    managementSystemMapping: '',
    itSystems: [],
    fromUserId: '',
    toUserId: ''
  });

  // Load document data when ID is present in URL
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      loadDocumentData(id);
    } else {
      // No id: start a new document (default to Word editor, empty data)
      setEditorType('word');
      setDocumentData({});
      setFormData({
        title: '',
        docType: 'Word',
        location: '',
        department: '',
        section: '',
        subSection: '',
        status: 'Draft',
        isLegalRequired: false,
        isGoldenRule: false,
        kpi: '',
        konzernMapping: '',
        managementSystemMapping: '',
        itSystems: [],
        fromUserId: '',
        toUserId: ''
      });
    }
  }, [searchParams]);

  const loadDocumentData = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:7119/api/ExportWordTipTap/get-by-id/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Loaded document data:', data);
      setDocumentData(data);
      
      // Update form data with loaded document data
      setFormData({
        title: data.title || '',
        docType: data.docType || 'Word',
        location: data.location || '',
        department: data.department || '',
        section: data.section || '',
        subSection: data.subSection || '',
        status: data.status || 'Draft',
        isLegalRequired: false,
        isGoldenRule: false,
        kpi: '',
        konzernMapping: '',
        managementSystemMapping: data.managementSystem || '',
        itSystems: data.itSystems ? data.itSystems.split(',') : [],
        fromUserId: data.fromUser || '',
        toUserId: data.toUser || ''
      });
      
      // Set the editor type based on document type
      if (data.docType && data.docType.toLowerCase() === 'excel') {
        setEditorType('excel');
      } else {
        setEditorType('word');
      }
      
    } catch (error) {
      console.error('Error loading document:', error);
      alert('Failed to load document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (payload) => {
    const id = searchParams.get('id');
    console.log(id,"jfksdjfklsdfkldsflksdfkdsjlkdsks");
    let response;
    try {
      if (id) {
        // Edit existing document
        response = await fetch(`https://localhost:7119/api/ExportWordTipTap/edit-doc/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new document
        response = await fetch('https://localhost:7119/api/ExportWordTipTap/save-doc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        const result = await response.json();
        console.log('Saved to API:', result);
        alert(id ? 'Document updated successfully!' : 'Document saved successfully!');
      } else {
        const error = await response.text();
        console.error('API error:', error);
        alert('Failed to save to backend.');
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('Network error or server unreachable.');
    }
  };

  const handleLoadJson = (jsonData) => {
    if (jsonData.content) {
      console.log('Loading JSON data:', jsonData);
      // The editor components will handle loading the content
    }
  };

  // Helper function to safely parse JSON content
  const parseJsonContent = (jsonContent) => {
    if (!jsonContent) return null;
    
    try {
      console.log('Raw JSON content:', jsonContent);
      const parsed = JSON.parse(jsonContent);
      console.log('Parsed JSON content:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error parsing JSON content:', error);
      console.error('JSON content that failed to parse:', jsonContent);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-container">
          <div className="loading">Loading document...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
     {/* Document Form Section */}
      <div className="form-section">
        <DocumentForm 
          onSave={handleSave}
          onLoadJson={handleLoadJson}
          formData={formData}
          onFormDataChange={handleFormDataChange}
          editor={editorInstance}
        />
      </div>

      {/* Editor Section - Direct editor based on document type */}
      <div className="editor-section">
        <div className="editor-header">
          <h3>
            {editorType === 'excel' ? '📊 Excel Editor' : '📝 Word Editor'}
          </h3>
        </div>
        
        <div className="editor-container">
          {editorType === 'excel' ? (
            <UniverEditorExcel 
              initialContent={parseJsonContent(documentData?.jsonContent)}
              documentData={documentData}
              setEditorInstance={setEditorInstance}
            />
          ) : (
            <Tiptap 
              initialContent={parseJsonContent(documentData?.jsonContent)}
              documentData={documentData}
              setEditorInstance={setEditorInstance}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;