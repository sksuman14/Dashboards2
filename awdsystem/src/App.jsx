import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SensorsData from './pages/SensorsData';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sensors" element={<SensorsData />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
