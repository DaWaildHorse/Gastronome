import { useState } from "react";

/**
 * Custom hook to manage camera access and functionality.
 * @returns {Object} - An object containing:
 *   - `stream` (MediaStream | null): The current camera stream.
 *   - `openCamera` (Function): Function to open the camera and start the stream.
 *   - `toggleCamera` (Function): Function to toggle between front and back cameras.
 *   - `useFrontCamera` (boolean): Indicates whether the front camera is currently in use. */
export const useCamera = () => {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null); // State to store the camera stream.
  const [useFrontCamera, setUseFrontCamera] = useState(false); // State to track whether the front camera is in use.

  /**
   * Opens the camera and starts the video stream.
   * Stops any existing stream before starting a new one.
   * If an error occurs, an alert is displayed.
   */
  const openCamera = async () => {
    try {
      if (cameraStream) cameraStream.getTracks().forEach(t => t.stop()); // Stop existing tracks.

      const constraints = {
        video: { facingMode: useFrontCamera ? "user" : "environment" }, // Set camera mode based on `useFrontCamera`.
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints); // Request camera access.
      setCameraStream(stream); // Save the new stream.
    } catch (err) {
      alert("No se pudo acceder a la cámara: " + err); // Display error message.
    }
  };

  /**
   * Toggles between the front and back cameras.
   * Stops the current stream and opens the camera with the new mode.
   */
  const toggleCamera = () => {
    setUseFrontCamera(prev => !prev); // Toggle the camera mode.
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop()); // Stop existing tracks.
    openCamera(); // Open the camera with the new mode.
  };

  return { stream: cameraStream, openCamera, toggleCamera, useFrontCamera };
};
