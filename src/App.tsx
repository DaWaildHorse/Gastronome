import React, { useState } from "react";
import Navbar from "./components/Navbar";
import IngredientsInput from "./components/IngredientInput";
import Camera from "./components/Camera";
import CapturedImage from "./components/CapturedImage";
import RecipeCards from "./components/RecipeCards";
import ProfileSettings from "./ProfileSettings";

import { useDarkMode } from "./hooks/useDarkMode";
import { useCamera } from "./hooks/useCamera";

import { generateThreeRecipes } from "./services/recipeService";
import { detectIngredientsFromImage } from "./services/detectionService";
import RECIPE_TYPES from "./services/recypeTypes";

import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./styles/App.css";

function App() {
  const [recipes, setRecipes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("buscar");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [user] = useState({ username: "Juan Pérez", email: "juanperez@example.com" });

  const { darkMode, toggleDarkMode } = useDarkMode();
  const camera = useCamera();

  const onSubmit = async (ingredients: string[]) => {
    setLoading(true);
    try {
      const result = await generateThreeRecipes(ingredients);
      setRecipes(result);
    } catch (e) {
      alert(`An error occurred: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendImage = async () => {
    if (!capturedImage) return;
    setLoading(true);
    try {
      const predictions = await detectIngredientsFromImage(capturedImage);
      setDetectedIngredients(predictions);
      const result = await generateThreeRecipes(predictions);
      setRecipes(result);
    } catch (e) {
      alert(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="app-container">
        {activeTab === "buscar" && (
          <>
            <h1 className="main-header">Gastronome</h1>

            <IngredientsInput onSubmit={onSubmit} />

            {!capturedImage ? (
              <Camera {...camera} onCapture={setCapturedImage} />
            ) : (
              <CapturedImage
                image={capturedImage}
                onRetake={() => {
                  setCapturedImage(null);
                  setRecipes([]);
                  setDetectedIngredients([]);
                  camera.openCamera();
                }}
                onSend={handleSendImage}
              />
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
                  <p>Loading recipes...</p>
                  <Loader size="large" />
                  <Placeholder size="large" />
                  <Placeholder size="large" />
                  <Placeholder size="large" />
                </div>
              ) : (
                recipes.length > 0 && <RecipeCards recipes={recipes} types={RECIPE_TYPES} />
              )}
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
