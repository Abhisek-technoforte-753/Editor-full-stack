import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DocumentList.css';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  // Get logged-in user from localStorage
  const user = (() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  // Filter documents for only those assigned to the logged-in user
  const filteredDocuments = user && user.id
    ? documents.filter(doc => String(doc.toUser) === String(user.id))
    : documents; // fallback: show all if no user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://localhost:7119/api/ExportWordTipTap/get-all');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setDocuments(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setError('Failed to fetch documents. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleEdit = (id) => {
    console.log('Edit document:', id);
    // TODO: Navigate to editor with document data
  };

  const handleDelete = (id) => {
    console.log('Delete document:', id);
    // TODO: Implement delete functionality
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const handleView = (id) => {
    console.log('View document:', id);
    // Navigate to editor with document ID as URL parameter
    navigate(`/editor?id=${id}`);
  };

  const getDocTypeIcon = (docType) => {
    switch (docType?.toLowerCase()) {
      case 'word':
        return '📝'; // Word document icon
      case 'excel':
        return '📊'; // Excel spreadsheet icon
      case 'pdf':
        return '📄'; // PDF document icon
      case 'powerpoint':
      case 'ppt':
        return '📊'; // PowerPoint icon
      case 'flowchart':
        return '📋'; // Flowchart icon
      default:
        return '📄'; // Default document icon
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return '#28a745';
      case 'Draft':
        return '#ffc107';
      case 'Pending Review':
        return '#17a2b8';
      case 'Released':
        return '#6f42c1';
      default:
        return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="document-list-container">
        <div className="loading">Loading documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="document-list-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="document-list-container">
      <div className="list-header">
        <h2>Document Management</h2>
        <div className="document-count">
          Total Documents: {filteredDocuments.length}
        </div>
      </div>

      <div className="table-container">
        <table className="document-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Department</th>
              <th>Location</th>
              <th>From User</th>
              <th>To User</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc) => (
              <tr key={doc.id}>
                <td className="title-cell">
                  <span className="doc-icon">{getDocTypeIcon(doc.docType)}</span>
                  {doc.title}
                </td>
                <td>{doc.docType}</td>
                <td>{doc.department || 'N/A'}</td>
                <td>{doc.location || 'N/A'}</td>
                <td>{doc.fromUser || 'N/A'}</td>
                <td>{doc.toUser || 'N/A'}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(doc.status || 'Draft') }}
                  >
                    {doc.status || 'Draft'}
                  </span>
                </td>
                <td>{formatDate(doc.createdAt)}</td>
                <td className="actions-cell">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleView(doc.id)}
                    title="View Document"
                  >
                    View
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(doc.id)}
                    title="Edit Document"
                  >
                    ✏️
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(doc.id)}
                    title="Delete Document"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredDocuments.length === 0 && (
        <div className="no-data">
          <p>No documents found</p>
        </div>
      )}
    </div>
  );
};

export default DocumentList; 