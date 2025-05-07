import { useState } from "react";

export const useCamera = () => {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState(false);

  const openCamera = async () => {
    try {
      if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());

      const constraints = {
        video: { facingMode: useFrontCamera ? "user" : "environment" },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
    } catch (err) {
      alert("No se pudo acceder a la cámara: " + err);
    }
  };

  const toggleCamera = () => {
    setUseFrontCamera(prev => !prev);
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    openCamera();
  };

  return { stream: cameraStream, openCamera, toggleCamera, useFrontCamera };
};
