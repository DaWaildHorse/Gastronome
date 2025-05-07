import React from "react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => (
  <div className="navbar">
    <button className={activeTab === "historial" ? "active" : ""} onClick={() => setActiveTab("historial")}>
      History
    </button>
    <button className={activeTab === "buscar" ? "active" : ""} onClick={() => setActiveTab("buscar")}>
      Search
    </button>
    <button className={activeTab === "perfil" ? "active" : ""} onClick={() => setActiveTab("perfil")}>
      Profile
    </button>
  </div>
);

export default Navbar;
