import { useEffect, useState } from "react";

// Custom hook to manage dark mode state
export const useDarkMode = () => {
  // State to track whether dark mode is enabled
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // On component mount, retrieve the saved dark mode preference from localStorage
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved); // Update state with the saved preference
    // Add or remove the "dark-mode" class on the <body> element based on the saved preference
    document.body.classList.toggle("dark-mode", saved);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to toggle dark mode on or off
  const toggleDarkMode = () => {
    const newValue = !darkMode; // Toggle the current dark mode state
    setDarkMode(newValue); // Update state with the new value
    // Add or remove the "dark-mode" class on the <body> element based on the new value
    document.body.classList.toggle("dark-mode", newValue);
    // Save the new dark mode preference to localStorage
    localStorage.setItem("darkMode", newValue.toString());
  };

  // Return the current dark mode state and the toggle function
  return { darkMode, toggleDarkMode };
};
