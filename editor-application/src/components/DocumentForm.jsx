import React, { useState,useEffect } from 'react'
import './DocumentForm.css'

const DocumentForm = ({ onSave, onLoadJson, editor, formData: externalFormData, onFormDataChange }) => {
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
    if (onFormDataChange) {
      onFormDataChange(field, value);
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    console.log(editor,"editor")

    if (!editor) return;
    console.log(editor,"editor")
    // Handle different editor types
    let json;
    if (editor.getJSON) {
      // Tiptap editor
      json = editor.getJSON();
    } else if (editor.getActiveWorkbook) {
      // Univer editor
      json = editor.getActiveWorkbook().getSnapshot();
    } else {
      console.error('Unknown editor type');
      return;
    }
    
    const payload = {
      title: currentFormData.title,
      docType: currentFormData.docType,
      jsonContent: JSON.stringify(json),
      location: currentFormData.location,
      department: currentFormData.department,
      section: currentFormData.section,
      subSection: currentFormData.subSection,
      status: currentFormData.status,
      managementSystem: currentFormData.managementSystemMapping,
      itSystems: Array.isArray(currentFormData.itSystems) ? currentFormData.itSystems.join(',') : currentFormData.itSystems,
      fromUser: "userA",
      toUser: currentFormData.toUserId
    };
console.log(payload,"ghkjhllkkjhkjhkjhk")
    if (onSave) {
      await onSave(payload);
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
      toUserId: ''
    };
    if (onFormDataChange) {
      // Clear each field using onFormDataChange
      Object.entries(emptyForm).forEach(([field, value]) => onFormDataChange(field, value));
    } else {
      setFormData(emptyForm);
    }
  };

  const loadJsonFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        console.log('Loading JSON data in DocumentForm:', jsonData);
        
        // Populate form data if available in the JSON
          if (onFormDataChange) {
            if (jsonData.title) onFormDataChange('title', jsonData.title);
            if (jsonData.docType) onFormDataChange('docType', jsonData.docType);
            if (jsonData.location) onFormDataChange('location', jsonData.location);
            if (jsonData.department) onFormDataChange('department', jsonData.department);
            if (jsonData.section) onFormDataChange('section', jsonData.section);
            if (jsonData.subSection) onFormDataChange('subSection', jsonData.subSection);
            if (jsonData.status) onFormDataChange('status', jsonData.status);
            if (jsonData.kpi) onFormDataChange('kpi', jsonData.kpi);
            if (jsonData.managementSystemMapping) onFormDataChange('managementSystemMapping', jsonData.managementSystemMapping);
            if (jsonData.itSystems) onFormDataChange('itSystems', Array.isArray(jsonData.itSystems) ? jsonData.itSystems : []);
            if (jsonData.toUserId) onFormDataChange('toUserId', jsonData.toUserId);
          } else {
            if (jsonData.title) setFormData(prev => ({ ...prev, title: jsonData.title }));
            if (jsonData.docType) setFormData(prev => ({ ...prev, docType: jsonData.docType }));
            if (jsonData.location) setFormData(prev => ({ ...prev, location: jsonData.location }));
            if (jsonData.department) setFormData(prev => ({ ...prev, department: jsonData.department }));
            if (jsonData.section) setFormData(prev => ({ ...prev, section: jsonData.section }));
            if (jsonData.subSection) setFormData(prev => ({ ...prev, subSection: jsonData.subSection }));
            if (jsonData.status) setFormData(prev => ({ ...prev, status: jsonData.status }));
            if (jsonData.kpi) setFormData(prev => ({ ...prev, kpi: jsonData.kpi }));
            if (jsonData.managementSystemMapping) setFormData(prev => ({ ...prev, managementSystemMapping: jsonData.managementSystemMapping }));
            if (jsonData.itSystems) setFormData(prev => ({ ...prev, itSystems: Array.isArray(jsonData.itSystems) ? jsonData.itSystems : [] }));
            if (jsonData.toUserId) setFormData(prev => ({ ...prev, toUserId: jsonData.toUserId }));
          }
        
        if (onLoadJson) {
          onLoadJson(jsonData);
        }
      } catch (err) {
        console.error('Error parsing JSON:', err);
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
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
             />
          </div>

          <div className="form-field">
            <label>Document Type:</label>
                         <select
               value={currentFormData.docType}
               onChange={(e) => handleInputChange('docType', e.target.value)}
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
             />
          </div>

          <div className="form-field">
            <label>Department:</label>
                         <input
               type="text"
               value={currentFormData.department}
               onChange={(e) => handleInputChange('department', e.target.value)}
               placeholder="Enter department"
             />
           </div>

           <div className="form-field">
             <label>Section:</label>
             <input
               type="text"
               value={currentFormData.section}
               onChange={(e) => handleInputChange('section', e.target.value)}
               placeholder="Enter section"
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
             />
           </div>

           <div className="form-field">
             <label>Status:</label>
             <select
               value={currentFormData.status}
               onChange={(e) => handleInputChange('status', e.target.value)}
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
             />
           </div>

           <div className="form-field">
             <label>Management:</label>
             <input
               type="text"
               value={currentFormData.managementSystemMapping}
               onChange={(e) => handleInputChange('managementSystemMapping', e.target.value)}
               placeholder="Enter management system"
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
              disabled={usersLoading || usersError}
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
             />
          </div>
        </div>
      </div>

      {/* Button Row */}
    <div className="button-row">
        {/* <button className="btn-secondary">Download Data</button> */}
        <button className="btn-primary" onClick={handleSave}>💾 Save-Json</button>
        <button className="btn-secondary" onClick={handleCancel}>Clear</button>
        {/* <button className="btn-secondary">Add</button> */}
        {/* <button className="btn-secondary">Edit</button> */}
    </div>
   </div>
  );
};

export default DocumentForm; 