import React from "react";

interface Props {
  image: string;
  onRetake: () => void;
  onSend: () => void;
}

const CapturedImage: React.FC<Props> = ({ image, onRetake, onSend }) => (
  <div className="captured-container">
    <img src={image} alt="Captured" className="captured-image" />
    <button type="button" className="camera-button" onClick={onRetake}>Reintentar</button>
    <button type="button" className="camera-button" onClick={onSend}>Enviar Imagen</button>
  </div>
);

export default CapturedImage;
