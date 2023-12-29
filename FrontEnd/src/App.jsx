import React from "react";
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Component/Home';


const App =() => {

  return (
    <div style={{ background: "#f4f5ff", width: "100vw", height: "100vh" }}>
      <Router>
        <Routes>
          <Route exact path={"*"} element={<div className="mt-5">Error</div>} />
          <Route exact path={"/"} Component={Home} />
          {/* <Route exact path={"/"} element={<Home/>} />  element and component*/}
        </Routes>
      </Router>
    </div>
  )
}

export default App
