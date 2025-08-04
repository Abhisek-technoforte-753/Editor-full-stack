import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
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
  const [urlId, setUrlId] = useState(null); // Store the ID from URL
  const [canEdit, setCanEdit] = useState(true); // Permission to edit document
  const { user } = useAuth(); // Get logged-in user
  
  // Debug: Log user data on component mount
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Home component - User data from localStorage:', loggedInUser);
    console.log('Home component - User data from AuthContext:', user);
  }, [user]);
  const [formData, setFormData] = useState({
    title: '',
    docType: 'Word',
    location: '',
    department: '',
    section: '',
    subSection: '',
    status: 'Draft',
    kpi: '',
    managementSystemMapping: '',
    itSystems: [],
    fromUserId: '',
    toUserId: ''
  });

  // Load document data when ID is present in URL
  useEffect(() => {
    const id = searchParams.get('id') || new URLSearchParams(window.location.search).get('id');
    const editorTypeParam = searchParams.get('type') || new URLSearchParams(window.location.search).get('type');
    console.log('useEffect - searchParams:', searchParams.toString());
    console.log('useEffect - window.location.search:', window.location.search);
    console.log('useEffect - extracted ID:', id);
    console.log('useEffect - editor type param:', editorTypeParam);
    
    // Store the ID in state for later use
    setUrlId(id);
    
    if (id) {
      loadDocumentData(id);
    } else {
      // No id: start a new document based on URL parameter or default to Word
      const newEditorType = editorTypeParam === 'excel' ? 'excel' : 'word';
      const newDocType = editorTypeParam === 'excel' ? 'Excel' : 'Word';
      
      console.log('Setting new document type:', { newEditorType, newDocType });
      
      setEditorType(newEditorType);
      setDocumentData({});
      setFormData({
        title: '',
        docType: newDocType,
        location: '',
        department: '',
        section: '',
        subSection: '',
        status: 'Draft',
        kpi: '',
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
      
      // Get logged-in user from localStorage for permission check
      const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Check if current user can edit this document
      const currentUserId = loggedInUser.id?.toString() || '';
      const documentCreatorId = data.fromUser?.toString() || '';
      const isCreator = currentUserId === documentCreatorId;
      
      console.log('Permission check:', {
        currentUserId,
        documentCreatorId,
        isCreator,
        canEdit: isCreator,
        loggedInUser
      });
      
      setCanEdit(isCreator);
      
      // Update form data with loaded document data
      setFormData({
        title: data.title || '',
        docType: data.docType || 'Word',
        location: data.location || '',
        department: data.department || '',
        section: data.section || '',
        subSection: data.subSection || '',
        status: data.status || 'Draft',
        kpi: data.kpi || '',
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
    // Use the stored ID from state, fallback to URL params
    const id = urlId || searchParams.get('id') || new URLSearchParams(window.location.search).get('id');
    console.log('Stored URL ID:', urlId);
    console.log('URL params:', searchParams.toString());
    console.log('Window location search:', window.location.search);
    console.log('Final extracted ID:', id);
    
    // Get editor content if editor instance is available
    let editorContent = null;
    if (editorInstance && editorInstance.getJSON) {
      editorContent = editorInstance.getJSON();
      console.log('Editor content:', editorContent);
    }
    
    // Get logged-in user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Logged in user from localStorage:', loggedInUser);
    
    // Merge form data with editor content and map to backend model
    const finalPayload = {
      title: payload.title,
      docType: payload.docType,
      jsonContent: editorContent ? JSON.stringify(editorContent) : payload.docJson || '',
      location: payload.location,
      department: payload.department,
      section: payload.section,
      subSection: payload.subSection,
      status: payload.status,
      managementSystem: payload.managementSystemMapping,
      itSystems: Array.isArray(payload.itSystems) ? payload.itSystems.join(', ') : payload.itSystems,
      fromUser: id ? payload.fromUserId : (loggedInUser.id?.toString() || ''), // Use logged-in user ID for new docs
      toUser: payload.toUserId,
      verId: 1, // Default version
      createdAt: new Date().toISOString()
    };
    
    console.log('Final payload to save:', finalPayload);
    
    let response;
    try {
      if (id) {
        // Edit existing document
        console.log('Updating existing document with ID:', id);
        response = await fetch(`https://localhost:7119/api/ExportWordTipTap/edit-doc/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalPayload)
        });
      } else {
        // Create new document
        console.log('Creating new document');
        response = await fetch('https://localhost:7119/api/ExportWordTipTap/save-doc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalPayload)
        });
      }

      if (response.ok) {
        const result = await response.json();
        console.log('Saved to API:', result);
        alert(id ? 'Document updated successfully!' : 'Document saved successfully!');
        
        // If this was a new document, redirect to the edit URL with the new ID
        if (!id && result.id) {
          window.history.pushState({}, '', `/editor?id=${result.id}`);
          setUrlId(result.id.toString());
        }
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
          canEdit={canEdit}
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
              readOnly={!canEdit}
            />
          ) : (
            <Tiptap 
              initialContent={parseJsonContent(documentData?.jsonContent)}
              documentData={documentData}
              setEditorInstance={setEditorInstance}
              readOnly={!canEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;