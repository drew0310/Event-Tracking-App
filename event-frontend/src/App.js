// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Landing from "./components/Landing/Landing";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home/:username"
          element={<Home />}
        />
        <Route
          path="/profile/:username"
          element={<Profile />}
        />
      </Routes>
    </Router>
  );
}

export default App;
