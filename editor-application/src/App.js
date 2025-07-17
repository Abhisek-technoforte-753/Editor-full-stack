
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Tiptap from './components/Tiptap';
import Dummy from './Dummy';
import VersionList from './components/VersionList';
import { Link } from 'react-router-dom';
import TiptapExcel from './components/TiptapExcel';
import UniverEditor from './components/UniverEditorExcel';

function App() {
 
  return (
    <div className="App">
      <h1>Document Editor</h1>
      
      <nav>
        <ul className='nav-links'>
          <li><Link to="/">Editor</Link></li>
          <li><Link to="/dummy">Dummy</Link></li>
          <li><Link to="/versions">Versions</Link></li>
          <li><Link to="/excel">Excel Luckysheet</Link></li>

          <li><Link to="/univer">Excel Editor</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Tiptap />} />
        <Route path="/dummy" element={<Dummy />} />
        <Route path="/versions" element={<VersionList />} />
        <Route path="/excel" element={<TiptapExcel />} />
        <Route path="/univer" element={<UniverEditor />} />
      </Routes>
    </div>
  );
}

export default App;
