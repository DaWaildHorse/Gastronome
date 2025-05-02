import { FormEvent, useState, useRef } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";



import "@aws-amplify/ui-react/styles.css";
import React from "react";
import { useEffect } from "react"; 

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showCapture, setShowCapture] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      const { data, errors } = await amplifyClient.queries.askBedrock({
        ingredients: [formData.get("ingredients")?.toString() || ""],
      });

      if (!errors) {
        setResult(data?.body || "No data returned");
      } else {
        console.log(errors);
      }

  
    } catch (e) {
      alert(`An error occurred: ${e}`);
    } finally {
      setLoading(false);
    }
  };
 

  useEffect(() => {
  if (videoRef.current && cameraStream) {
    videoRef.current.srcObject = cameraStream;
  }
  }, [cameraStream]);

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
    } catch (err) {
      alert("No se pudo acceder a la cámara: " + err);
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/png");
        console.log("Captured Image Data URL:", imageDataUrl);
        alert("Foto capturada. Mira la consola para el Data URL.");
      }
    }
  };

  return (
    <div className="app-container">
      <div className="header-container">
        <h1 className="main-header">
          Gastronome
          <br />
        </h1>
        <p className="description">

        </p>
      </div>
      <form onSubmit={onSubmit} className="form-container">
        <div className="search-container">
          <input
            type="text"
            className="wide-input"
            id="ingredients"
            name="ingredients"
            placeholder="Ingredient1, Ingredient2, Ingredient3,...etc"
          />
          <button type="submit" className="search-button">
            Generate
          </button>
        </div>
      </form>

      <button
  type="button"
  className="camera-button"
  onClick={handleOpenCamera}
>
  Abrir Cámara
</button>

{cameraStream && (
  <>
    <video ref={videoRef} width="320" height="240" autoPlay playsInline />
    <canvas ref={canvasRef} width="320" height="240" style={{ display: "none" }} />
    <button type="button" className="capture-button" onClick={handleCapture}>
      Capturar Foto
    </button>
  </>
)}

{showCapture && (
  <>
    <video
      ref={videoRef}
      width="320"
      height="240"
      autoPlay
    />
    <canvas
      ref={canvasRef}
      width="320"
      height="240"
      style={{ display: "none" }}
    />
    <button
      type="button"
      className="capture-button"
      onClick={handleCapture}
    >
      Capturar Foto
    </button>
  </>
)}
      
      <div className="result-container">
        {loading ? (
          <div className="loader-container">
            <p>Loading...</p>
            <Loader size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
          </div>
        ) : (
          result && <p className="result">{result}</p>
        )}
      </div>
    </div>
    
  );
}

export default App;