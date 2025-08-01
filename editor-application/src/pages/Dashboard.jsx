import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: '20px' }}>
        <span className="dashboard-user-email" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.email}</span>
      </div>
      
      <div className="dashboard-content">

       <div className="dashboard-card">
          <h2>Document</h2>
          <p>Create and edit rich text documents with advanced formatting options.</p>
          <button onClick={() => navigate('/')} className="dashboard-btn">
  Assigned Document
</button>
        </div>

        <div className="dashboard-card">
          <h2>Document Editor</h2>
          <p>Create and edit rich text documents with advanced formatting options.</p>
          <button onClick={() => navigate('/editor')} className="dashboard-btn">
  Open Editor
</button>
        </div>

        <div className="dashboard-card">
          <h2>Excel Editor</h2>
          <p>Work with spreadsheets using the powerful Univer Excel editor.</p>
          <button onClick={() => navigate('/editor')} className="dashboard-btn">
  Open Excel Editor
</button>
        </div>

        <div className="dashboard-card">
          <h2>Version History</h2>
          <p>View and manage document versions and history.</p>
          <button onClick={() => navigate('/versions')} className="dashboard-btn">
  View Versions
</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 