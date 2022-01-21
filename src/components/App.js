import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Dashboard from './Dashboard/Dashboard';
import Contract from './Contract/Contract';
import BuyFleepScreen from './BuyFleep/BuyFleepScreen';

export default function App() {
  return (
    <Router>
      <Routes>
          <Route exact path="/" element={<Dashboard/>}/>
          <Route exact path="/dashboard" element={<Dashboard/>}/>
          <Route exact path="/contract" element={<Contract/>}/>
          <Route exact path="/buyFleep" element={<BuyFleepScreen/>}/>
        </Routes>
    </Router>
  );
}
