import { FormEvent, useState, useRef } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import ProfileSettings from "./ProfileSettings";




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
  const [activeTab, setActiveTab] = useState("buscar");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showCapture, setShowCapture] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
// Estado para el perfil del usuario
  const [darkMode, setDarkMode] = useState(false); // Estado para el modo oscuro

  const [user, setUser] = useState<any>({
    username: "Juan Pérez", // Nombre de ejemplo para el perfil
    email: "juanperez@example.com", // Correo de ejemplo
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode); // Cambiar la clase para el modo oscuro
  };
  
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  
    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);
  
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      setCameraStream(stream);
    } catch (err) {
      alert("No se pudo acceder a la cámara: " + err);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => (prev === "user" ? "environment" : "user"));
    if (cameraStream) {
      // Detener el stream actual antes de abrir el nuevo
      cameraStream.getTracks().forEach(track => track.stop());
    }
    handleOpenCamera();
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
  
    if (video && canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/png");
        setCapturedImage(imageDataUrl);
  
        // Detiene la cámara
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    }
  };


  const handleRetake = () => {
    setCapturedImage(null);
    handleOpenCamera(); 
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
      <button
          className={activeTab === "historial" ? "active" : ""}
          onClick={() => setActiveTab("historial")}
        >
          Historial
        </button>
        <button
          className={activeTab === "buscar" ? "active" : ""}
          onClick={() => setActiveTab("buscar")}
        >
          Buscar
        </button>
        <button
          className={activeTab === "perfil" ? "active" : ""}
          onClick={() => setActiveTab("perfil")}
        >
          Perfil
        </button>
      </div>
  
      {/* CONTENIDO SEGÚN PESTAÑA */}
      <div className="app-container">
        {activeTab === "buscar" && (
          <>
            <div className="header-container">
              <h1 className="main-header">Gastronome</h1>
              <p className="description"></p>
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
  
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
              <button type="button" className="camera-button" onClick={handleOpenCamera}>
                Abrir Cámara
              </button>
              <button type="button" className="camera-button" onClick={toggleCamera}>
                Voltear Cámara
              </button>
            </div>
  
            {cameraStream && !capturedImage && (
              <div className="camera-frame">
                <video ref={videoRef} width="640" height="480" autoPlay playsInline />
                <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
                <button type="button" className="shutter-button" onClick={handleCapture} />
              </div>
            )}


            
  
            {capturedImage && (
              <div className="captured-container">
                <img src={capturedImage} alt="Captura" className="captured-image" />
                <button type="button" className="camera-button" onClick={handleRetake}>
                  Reintentar
                </button>
              </div>
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
          </>
        )}
  
        {activeTab === "historial" && (
          <div>
            
          </div>
        )}
  
        {activeTab === "perfil" && (
          <ProfileSettings
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            user={user} 
          />
        )}
      </div>
    </>
  );
}

export default App;