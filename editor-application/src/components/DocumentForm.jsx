import React, { useState,useEffect } from 'react'
import './DocumentForm.css'

const DocumentForm = ({ onSave, onLoadJson, editor, formData: externalFormData, onFormDataChange, canEdit = true }) => {
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

  // Users state for select box
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const response = await fetch('https://localhost:7119/api/Auth/get-users');
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          setUsersError('Failed to load users');
        }
      } catch (err) {
        setUsersError('Error fetching users');
      } finally {
        setUsersLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Use external form data if provided
  const currentFormData = externalFormData || formData;
  const handleInputChange = (field, value) => {
    if (!canEdit) return; // Prevent changes if not editable
    
    if (onFormDataChange) {
      onFormDataChange(field, value);
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  

  const handleCancel = () => {
    const emptyForm = {
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
    };
    if (onFormDataChange) {
      // Clear each field using onFormDataChange
      Object.entries(emptyForm).forEach(([field, value]) => onFormDataChange(field, value));
    } else {
      setFormData(emptyForm);
    }
  };

  const handleSaveClick = () => {
    if (!canEdit) {
      alert('You do not have permission to edit this document.');
      return;
    }
    
    // Create payload with form data only
    // Editor content will be added by the parent component
    const payload = {
      ...currentFormData,
      createdAt: new Date().toISOString()
    };
    
    console.log('DocumentForm - Form data payload:', payload);
    
    // Call the parent's onSave function
    if (onSave) {
      onSave(payload);
    }
  };


  return (
    <div className="document-form-container">
      <div className="form-header">
        <h2>Document Management System</h2>
        <div className="sub-header">PLANT 1 : Quality Inspection Dept. 1</div>
      </div>

      <div className="form-grid">
        {/* Column 1 */}
        <div className="form-column">
          <div className="form-field">
            <label>Title:</label>
                         <input
               type="text"
               value={currentFormData.title}
               onChange={(e) => handleInputChange('title', e.target.value)}
               placeholder="Enter document title"
               disabled={!canEdit}
             />
          </div>

          <div className="form-field">
            <label>Document Type:</label>
                         <select
               value={currentFormData.docType}
               onChange={(e) => handleInputChange('docType', e.target.value)}
               disabled={!canEdit}
             >
              <option value="Word">Word</option>
              <option value="Excel">Excel</option>
              <option value="Flowchart">Flowchart</option>
            </select>
          </div>

          <div className="form-field">
            <label>Location:</label>
                         <input
               type="text"
               value={currentFormData.location}
               onChange={(e) => handleInputChange('location', e.target.value)}
               placeholder="Enter location"
               disabled={!canEdit}
             />
          </div>

          <div className="form-field">
            <label>Department:</label>
                         <input
               type="text"
               value={currentFormData.department}
               onChange={(e) => handleInputChange('department', e.target.value)}
               placeholder="Enter department"
               disabled={!canEdit}
             />
           </div>

           <div className="form-field">
             <label>Section:</label>
             <input
               type="text"
               value={currentFormData.section}
               onChange={(e) => handleInputChange('section', e.target.value)}
               placeholder="Enter section"
               disabled={!canEdit}
             />
          </div>
        </div>

        {/* Column 2 */}
        <div className="form-column">
          <div className="form-field">
            <label>Sub Section:</label>
                         <input
               type="text"
               value={currentFormData.subSection}
               onChange={(e) => handleInputChange('subSection', e.target.value)}
               placeholder="Enter sub section"
               disabled={!canEdit}
             />
           </div>

           <div className="form-field">
             <label>Status:</label>
             <select
               value={currentFormData.status}
               onChange={(e) => handleInputChange('status', e.target.value)}
               disabled={!canEdit}
             >
              <option value="Draft">Draft</option>
              <option value="PendingReview">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Released">Released</option>
            </select>
          </div>

          <div className="form-field">
            <label>KPI:</label>
                         <input
               type="text"
               value={currentFormData.kpi}
               onChange={(e) => handleInputChange('kpi', e.target.value)}
               placeholder="Enter KPI"
               disabled={!canEdit}
             />
           </div>

           <div className="form-field">
             <label>Management:</label>
             <input
               type="text"
               value={currentFormData.managementSystemMapping}
               onChange={(e) => handleInputChange('managementSystemMapping', e.target.value)}
               placeholder="Enter management system"
               disabled={!canEdit}
             />
          </div>
        </div>

        {/* Column 3 */}
        <div className="form-column">
          <div className="form-field">
            <label>To User:</label>
            <select
              value={currentFormData.toUserId}
              onChange={(e) => handleInputChange('toUserId', e.target.value)}
              disabled={usersLoading || usersError || !canEdit}
            >
              <option value="">{usersLoading ? 'Loading users...' : usersError ? 'Error loading users' : 'Select a user'}</option>
              {!usersLoading && !usersError && users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
            {usersError && <div style={{color: 'red', fontSize: '0.9em'}}>{usersError}</div>}
          </div>

           <div className="form-field">
             <label>IT Systems:</label>
             <input
               type="text"
               value={currentFormData.itSystems.join(', ')}
               onChange={(e) => handleInputChange('itSystems', e.target.value.split(', ').filter(item => item.trim()))}
               placeholder="Enter IT systems (comma separated)"
               disabled={!canEdit}
             />
          </div>
        </div>
      </div>

      {/* Button Row */}
    <div className="button-row">
        
        <button className="btn-primary" onClick={handleSaveClick} disabled={!canEdit}>
          {canEdit ? '💾 Save Document' : '👁️ View Only'}
        </button>
        <button className="btn-secondary" onClick={handleCancel} disabled={!canEdit}>Clear</button>
      
    </div>
   </div>
  );
};

export default DocumentForm; 