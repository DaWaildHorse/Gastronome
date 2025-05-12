import React from "react";
import "./styles/ProfileSettings.css";
interface ProfileSettingsProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: any;
} 

/**
 * A React functional component that renders the profile settings UI.
 *
 * @component
 * @param {ProfileSettingsProps} props - The props for the component.
 * @param {boolean} props.darkMode - Indicates whether dark mode is enabled.
 * @param {() => void} props.toggleDarkMode - A function to toggle the dark mode state.
 * @param {Object} [props.user] - The user object containing user details.
 * @param {string} [props.user.username] - The username of the user.
 * @param {string} [props.user.email] - The email address of the user.
 *
 * @returns {JSX.Element} The rendered profile settings component.
 *
 */
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