import React from "react";
import "./ProfileSettings.css"; // Archivo de estilos para este componente

interface ProfileSettingsProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: any;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  darkMode,
  toggleDarkMode,
  user,
}) => {
  return (
    <div className="profile-settings">
      <h2>Configuración de Usuario</h2>

      <div className="setting-item">
        <label>Modo Oscuro:</label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={toggleDarkMode}
        />
      </div>

      <div className="setting-item">
        <label>Nombre:</label>
        <input
          type="text"
          placeholder="Tu nombre"
          value={user?.username || ""}
          disabled
        />
      </div>

      <div className="setting-item">
        <label>Correo electrónico:</label>
        <input
          type="text"
          placeholder="Tu correo"
          value={user?.email || ""}
          disabled
        />
      </div>

      <div className="setting-item">
        <button onClick={() => alert("Cerrar sesión (esta función es opcional)")}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default ProfileSettings;