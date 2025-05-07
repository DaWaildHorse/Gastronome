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
import { getUnsplashImageForRecipe } from "./services/imageService";

import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./styles/App.css";

function App() {
  const [recipes, setRecipes] = useState<string[]>([]);
  const [recipeHistory, setRecipeHistory] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("buscar");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [user] = useState({ username: "Juan Pérez", email: "juanperez@example.com" });
  const [recipeImages, setRecipeImages] = useState<string[]>([]);

  const { darkMode, toggleDarkMode } = useDarkMode();
  const camera = useCamera();

  const extractTitleFromRecipe = (recipe: string): string => {
    const match = recipe.match(/:(.*?)Ingredients:/s);
    return match?.[1]?.trim() || "Unknown Recipe";
  };

  const extractIngredientsSection = (recipe: string): string => {
    const match = recipe.match(/(Ingredients:.*)/is);
    return match?.[1]?.trim() || "Ingredients not found.";
  };

  const buildRecipeTypes = (recipes: string[], images: string[]) => {
    return recipes.map((recipe, index) => ({
      title: extractTitleFromRecipe(recipe),
      description: extractIngredientsSection(recipe),
      imageUrl: images[index] || "/fallback.jpg",
    }));
  };

  const onSubmit = async (ingredients: string[]) => {
    setLoading(true);
    try {
      const result = await generateThreeRecipes(ingredients);
      setRecipes(result);
      await fetchRecipeImages(result);
      setRecipeHistory((prev) => [result, ...prev]);
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
      await fetchRecipeImages(result);
      setRecipeHistory((prev) => [result, ...prev]);
    } catch (e) {
      alert(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeImages = async (recipes: string[]) => {
    const titles = recipes.map(extractTitleFromRecipe);
    const images = await Promise.all(titles.map((title) => getUnsplashImageForRecipe(title)));
    setRecipeImages(images);
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
                recipes.length > 0 && (
                  <RecipeCards
                    recipes={recipes}
                    types={buildRecipeTypes(recipes, recipeImages)}
                    images={recipeImages}
                  />
                )
              )}
            </div>
          </>
        )}

        {activeTab === "historial" && (
          <div className="result-container">
            <h2>Recipe History</h2>
            {recipeHistory.map((pastRecipes, index) => (
              <RecipeCards
                key={index}
                recipes={pastRecipes}
                types={buildRecipeTypes(pastRecipes, recipeImages)}
                images={recipeImages}
              />
            ))}
          </div>
        )}

        {activeTab === "perfil" && (
          <ProfileSettings darkMode={darkMode} toggleDarkMode={toggleDarkMode} user={user} />
        )}
      </div>
    </>
  );
}

export default App;
