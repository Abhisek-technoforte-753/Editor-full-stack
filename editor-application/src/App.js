
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Tiptap from './components/Tiptap';
import Dummy from './Dummy';
import VersionList from './components/VersionList';
import { Link } from 'react-router-dom';

function App() {
 
  return (
    <div className="App">
      <h1>Document Editor</h1>
      
      <nav>
        <ul>
          <li><Link to="/">Editor</Link></li>
          <li><Link to="/dummy">Dummy</Link></li>
          <li><Link to="/versions">Versions</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Tiptap />} />
        <Route path="/dummy" element={<Dummy />} />
        <Route path="/versions" element={<VersionList />} />
      </Routes>
    </div>
  );
}

export default App;
