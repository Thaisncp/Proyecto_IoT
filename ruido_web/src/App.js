import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Graficas from './fragment/Graficas';
import Historial from './fragment/Historial';
import ChatBot from './fragment/chatbot';

function App() {
  return (
    <Router>
      <ChatBot /> 
      <Routes>
        <Route path='/' element={<Graficas />} />
        <Route path='/historial' element={<Historial />} />
      </Routes>
    </Router>
  );
}

export default App;