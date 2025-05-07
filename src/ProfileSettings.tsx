import React from "react";
import "./styles/ProfileSettings.css";
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
      <h2>User Configuration</h2>

      <div className="setting-item">
        <label>Dark Mode</label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={toggleDarkMode}
        />
      </div>

      <div className="setting-item">
        <label>Name:</label>
        <input
          type="text"
          placeholder="Your name"
          value={user?.username || ""}
          disabled
        />
      </div>

      <div className="setting-item">
        <label>email:</label>
        <input
          type="text"
          placeholder="Your email"
          value={user?.email || ""}
          disabled
        />
      </div>

      <div className="setting-item">
        <button>Log out</button>
      </div>
    </div>
  );
};

export default ProfileSettings;