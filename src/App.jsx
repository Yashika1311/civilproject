import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import StructuralCalculator from './components/StructuralCalculator';
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/beam" element={<StructuralCalculator type="beam" />} />
        <Route path="/column" element={<StructuralCalculator type="column" />} />
        <Route path="/footing" element={<StructuralCalculator type="footing" />} />
        <Route path="/slab" element={<StructuralCalculator type="slab" />} />
      </Routes>
    </Router>
  );
}

export default App;
