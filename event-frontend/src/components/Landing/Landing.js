import React, { useState, useEffect } from "react";
import "./Landing.css";
import { useNavigate } from "react-router-dom";


const Landing = () => {
  const navigate = useNavigate();
  const appName = "Planify";
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [loopIndex, setLoopIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 35;
  const deletingSpeed = 35;
  const delay = 2000;

  useEffect(() => {
    const phrases = [
      "your cat's birthday celebration 🎉",
      "the most important meeting you'll ever forget 😬",
      "that yoga class you'll always skip 🧘",
      "your coffee date with destiny ☕",
      "your early morning call with your boss 😵‍💫",
      "watering your (dead) plants 🪴",
      "the road trip you'll always reminisce about 🚗",
    ];
    const currentText = phrases[loopIndex % phrases.length];

    if (!isDeleting && charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setCurrentPhrase(currentPhrase + currentText[charIndex]);
        setCharIndex(charIndex + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex > 0) {
      const timeout = setTimeout(() => {
        setCurrentPhrase(currentPhrase.slice(0, -1));
        setCharIndex(charIndex - 1);
      }, deletingSpeed);

      return () => clearTimeout(timeout);
    }

    if (!isDeleting && charIndex === currentText.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, delay);

      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setLoopIndex(loopIndex + 1);
    }
  }, [charIndex, isDeleting, currentPhrase, loopIndex]);

  return (
    <div className="landing-page">
      <div className="landing-page-header">
        <h1 className="app-title">{appName}</h1>
        <p className="current-time">
          {`It is now \n ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })} \n on \n ${new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`}
        </p>
      </div>

      <div className="main-content">
        <h2>
          <span className="static-text">Create, manage and keep track of </span>
          <span className="dynamic-text">
            {currentPhrase}
            <span className="cursor"></span>
          </span>
        </h2>
        <div className="buttons">
          <button className="btn login" onClick={() => navigate("/login")}>Login</button>
          <button className="btn register" onClick={() => navigate("/register")}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;



