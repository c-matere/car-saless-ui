import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LaptopView from './components/LaptopView';
import LaptopExplore from './components/LaptopExplore';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LaptopViewWrapper />} />
          <Route path="/explore" element={<LaptopExploreWrapper />} />
        </Routes>
      </div>
    </Router>
  );
}

// Wrapper components to handle navigation
function LaptopViewWrapper() {
  const navigate = useNavigate();
  return <LaptopView onExploreCars={() => navigate('/explore')} />;
}

function LaptopExploreWrapper() {
  const navigate = useNavigate();
  return <LaptopExplore onBack={() => navigate('/')} />;
}

export default App;
