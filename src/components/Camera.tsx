import React, { useEffect, useRef } from "react";
import { MdFlipCameraAndroid } from "react-icons/md";

interface CameraProps {
  stream: MediaStream | null;
  openCamera: () => void;
  toggleCamera: () => void;
  useFrontCamera: boolean;
  onCapture: (image: string) => void;
}

const Camera: React.FC<CameraProps> = ({ stream, openCamera, toggleCamera, useFrontCamera, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    openCamera();
  }, [useFrontCamera]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/png");
        onCapture(imageDataUrl);
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    }
  };

  return (
    <div className="camera-frame">
      <video ref={videoRef} width="640" height="480" autoPlay playsInline />
      <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
      <button type="button" className="shutter-button" onClick={handleCapture} />
      <button type="button" className="toggle-camera-button" onClick={toggleCamera}>
        <MdFlipCameraAndroid size={24} />
      </button>
    </div>
  );
};

export default Camera;
