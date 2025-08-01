
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './App.css';
import Tiptap from './components/Tiptap';
import Dummy from './Dummy';
import VersionList from './components/VersionList';
import { Link } from 'react-router-dom';
// import TiptapExcel from './components/TiptapExcel';
import UniverEditor from './components/UniverEditorExcel';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/Dashboard';
import Home from './components/Home';
import DocumentList from './components/Documents/DocumentList';


import { useNavigate } from 'react-router-dom';

function App() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
 
  return (
   
      <div className="App">
       <nav>
           <ul className='nav-links'>
            <li><Link to="/dashboard">Dashboard</Link></li>
             <li><Link to="/versions">Versions</Link></li>
             
             {/* Authentication Links */}
             {!isLoggedIn ? (
               <>
                 <li><Link to="/login">Login</Link></li>
                 <li><Link to="/signup">Sign Up</Link></li>
               </>
             ) : (
               <li  onClick={() => logout(() => navigate('/login'))}
               id="logout-btn" >Logout</li>
             )}
           </ul>
         </nav>
        
        <Routes>
          <Route path="/" element={<DocumentList />} />
          <Route path="/editor" element={<Home />} />
          <Route path="/versions" element={<VersionList />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
   
  );
}

export default App;
