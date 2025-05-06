import React, { FormEvent, useState, useRef, useEffect } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import ProfileSettings from "./ProfileSettings";
import { MdFlipCameraAndroid } from "react-icons/md";

import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

// Recipe type definitions
const RECIPE_TYPES = [
  {
    title: "Recipe",
    description: ""
  },
  {
    title: "Recipe",
    description: "A simple and fast recipe under 30 minutes with these ingredients"
  },
  {
    title: "Chef's Special",
    description: "A gourmet restaurant-style dish with these ingredients"
  }
];

function App() {
  const [recipes, setRecipes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("buscar");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showCapture, setShowCapture] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [darkMode, setDarkMode] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [activeRecipeIndex, setActiveRecipeIndex] = useState(0);
  const [user, setUser] = useState<any>({
    username: "Juan Pérez",
    email: "juanperez@example.com",
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
    localStorage.setItem("darkMode", (!darkMode).toString());
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
      const ingredients = formData.get("ingredients")?.toString() || "";
      
      await generateThreeRecipes(ingredients.split(",").map(i => i.trim()));
    } catch (e) {
      alert(`An error occurred: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate three different recipes with the same ingredients
  const generateThreeRecipes = async (ingredients: string[]) => {
    setLoading(true);
    setRecipes([]);
    
    try {
      // Sequential calls to make 3 separate recipes
      const allRecipes: string[] = [];
      
      // First recipe - Classic
      const classic = await amplifyClient.queries.askBedrock({
        ingredients: [...ingredients]
      });
      allRecipes.push(classic.errors 
        ? `Error: ${classic.errors.map(e => e.message).join(", ")}` 
        : (classic.data?.body || "No data returned"));
      
      // Second recipe - Quick & Easy
      const quick = await amplifyClient.queries.askBedrock({
        ingredients: [...ingredients]
      });
      allRecipes.push(quick.errors 
        ? `Error: ${quick.errors.map(e => e.message).join(", ")}` 
        : (quick.data?.body || "No data returned"));
      
      // Third recipe - Chef's Special
      const special = await amplifyClient.queries.askBedrock({
        ingredients: [...ingredients]
      });
      allRecipes.push(special.errors 
        ? `Error: ${special.errors.map(e => e.message).join(", ")}` 
        : (special.data?.body || "No data returned"));
      
      setRecipes(allRecipes);
      setActiveRecipeIndex(0);
    } catch (e) {
      alert(`An error occurred while generating recipes: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    if (activeTab === "buscar") {
      handleOpenCamera();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "buscar") {
      handleOpenCamera();
    }
  }, [useFrontCamera]);

  const handleOpenCamera = async () => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: useFrontCamera ? "user" : "environment",
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
    } catch (err) {
      alert("No se pudo acceder a la cámara: " + err);
    }
  };

  const toggleCamera = () => {
    setUseFrontCamera(prev => !prev);
    setFacingMode(prev => (prev === "user" ? "environment" : "user"));
    if (cameraStream) {
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

        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setRecipes([]);
    setDetectedIngredients([]);
    handleOpenCamera();
  };

  const handleSendImage = async () => {
    if (!capturedImage) return;
  
    setLoading(true);
  
    try {
      const res = await fetch(capturedImage);
      const blob = await res.blob();
  
      const formData = new FormData();
      formData.append("image", blob, "captured.png");
  
      const response = await fetch("http://54.227.211.114:5000/predict", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Save detected ingredients
        setDetectedIngredients(data.predictions);
        
        // Generate three different recipes with the same detected ingredients
        await generateThreeRecipes(data.predictions);
      } else {
        alert("Server Error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      alert("Fetch Error: " + error);
    } finally {
      setLoading(false);
    }
  };

  const switchRecipe = (index: number) => {
    if (index >= 0 && index < recipes.length) {
      setActiveRecipeIndex(index);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <button className={activeTab === "historial" ? "active" : ""} onClick={() => setActiveTab("historial")}>
          Historial
        </button>
        <button className={activeTab === "buscar" ? "active" : ""} onClick={() => setActiveTab("buscar")}>
          Buscar
        </button>
        <button className={activeTab === "perfil" ? "active" : ""} onClick={() => setActiveTab("perfil")}>
          Perfil
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="app-container">
        {activeTab === "buscar" && (
          <>
            <div className="header-container">
              <h1 className="main-header">Gastronome</h1>
            </div>

            <form onSubmit={onSubmit} className="form-container">
              <div className="search-container">
                <input
                  type="text"
                  className="wide-input"
                  id="ingredients"
                  name="ingredients"
                  placeholder="Ingredient1, Ingredient2, etc"
                />
                <button type="submit" className="search-button">
                  Generate
                </button>
              </div>
            </form>

            {cameraStream && !capturedImage && (
              <div className="camera-frame">
                <video ref={videoRef} width="640" height="480" autoPlay playsInline />
                <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
                <button type="button" className="shutter-button" onClick={handleCapture} />
                <button type="button" className="toggle-camera-button" onClick={toggleCamera}>
                  <MdFlipCameraAndroid size={24} />
                </button>
              </div>
            )}

            {capturedImage && (
              <div className="captured-container">
                <img src={capturedImage} alt="Captura" className="captured-image" />
                <button type="button" className="camera-button" onClick={handleRetake}>
                  Reintentar
                </button>
                <button type="button" className="camera-button" onClick={handleSendImage}>
                  Enviar Imagen
                </button>
              </div>
            )}

            {detectedIngredients.length > 0 && (
              <div className="ingredients-container">
                <h3>Detected Ingredients:</h3>
                <p>{detectedIngredients.join(", ")}</p>
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
              ) : recipes.length > 0 ? (
                <>
                  <div className="recipe-tabs">
                    {RECIPE_TYPES.map((type, index) => (
                      <button 
                        key={index}
                        className={activeRecipeIndex === index ? "recipe-tab active" : "recipe-tab"}
                        onClick={() => switchRecipe(index)}
                      >
                        {type.title}
                      </button>
                    ))}
                  </div>
                  <div className="recipe-content">
                    <p className="result">{recipes[activeRecipeIndex]}</p>
                  </div>
                </>
              ) : null}
            </div>
          </>
        )}

        {activeTab === "historial" && <div></div>}

        {activeTab === "perfil" && (
          <ProfileSettings darkMode={darkMode} toggleDarkMode={toggleDarkMode} user={user} />
        )}
      </div>
    </>
  );
}

export default App;