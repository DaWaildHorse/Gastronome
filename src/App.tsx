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
  // State variables for managing application data
  const [recipes, setRecipes] = useState<string[]>([]); // Stores the generated recipes
  const [recipeHistory, setRecipeHistory] = useState<string[][]>([]); // Stores the history of recipes
  const [loading, setLoading] = useState(false); // Indicates if the app is loading data
  const [activeTab, setActiveTab] = useState("buscar"); // Tracks the active tab in the UI
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Stores the captured image
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]); // Stores detected ingredients from the image
  const [user] = useState({ username: "Juan Pérez", email: "juanperez@example.com" }); // Mock user data
  const [recipeImages, setRecipeImages] = useState<string[]>([]); // Stores images for recipes

  // Custom hooks for dark mode and camera functionality
  const { darkMode, toggleDarkMode } = useDarkMode();
  const camera = useCamera();

  // Extracts the title of a recipe from its text
  const extractTitleFromRecipe = (recipe: string): string => {
    const match = recipe.match(/:(.*?)Ingredients:/s);
    return match?.[1]?.trim() || "Unknown Recipe";
  };

  // Extracts the ingredients section from a recipe's text
  const extractIngredientsSection = (recipe: string): string => {
    const match = recipe.match(/(Ingredients:.*)/is);
    return match?.[1]?.trim() || "Ingredients not found.";
  };

  // Builds recipe objects with title, description, and image URL
  const buildRecipeTypes = (recipes: string[], images: string[]) => {
    return recipes.map((recipe, index) => ({
      title: extractTitleFromRecipe(recipe),
      description: extractIngredientsSection(recipe),
      imageUrl: images[index] || "/fallback.jpg", // Fallback image if no image is available
    }));
  };

  // Handles form submission with ingredients input
  const onSubmit = async (ingredients: string[]) => {
    setLoading(true); // Show loading indicator
    try {
      const result = await generateThreeRecipes(ingredients); // Generate recipes
      setRecipes(result); // Update recipes state
      await fetchRecipeImages(result); // Fetch images for recipes
      setRecipeHistory((prev) => [result, ...prev]); // Add to recipe history
    } catch (e) {
      alert(`An error occurred: ${e}`); // Handle errors
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Handles sending the captured image for ingredient detection
  const handleSendImage = async () => {
    if (!capturedImage) return; // Do nothing if no image is captured
    setLoading(true); // Show loading indicator
    try {
      const predictions = await detectIngredientsFromImage(capturedImage); // Detect ingredients
      setDetectedIngredients(predictions); // Update detected ingredients state
      const result = await generateThreeRecipes(predictions); // Generate recipes
      setRecipes(result); // Update recipes state
      await fetchRecipeImages(result); // Fetch images for recipes
      setRecipeHistory((prev) => [result, ...prev]); // Add to recipe history
    } catch (e) {
      alert(`Error: ${e}`); // Handle errors
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Fetches images for the given recipes
  const fetchRecipeImages = async (recipes: string[]) => {
    const titles = recipes.map(extractTitleFromRecipe); // Extract titles from recipes
    const images = await Promise.all(titles.map((title) => getUnsplashImageForRecipe(title))); // Fetch images
    setRecipeImages(images); // Update recipe images state
  };

  return (
    <>
      {/* Navbar component for navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="app-container">
        {/* Tab content for "buscar" (search) */}
        <div className={`tab-content ${activeTab === "buscar" ? "active" : "inactive"}`}>
          {activeTab === "buscar" && (
            <>
              <h1 className="main-header">Gastronome</h1>

              {/* Input for ingredients */}
              <IngredientsInput onSubmit={onSubmit} />

              {/* Camera or captured image display */}
              {!capturedImage ? (
                <Camera {...camera} onCapture={setCapturedImage} />
              ) : (
                <CapturedImage
                  image={capturedImage}
                  onRetake={() => {
                    setCapturedImage(null); // Reset captured image
                    setRecipes([]); // Clear recipes
                    setDetectedIngredients([]); // Clear detected ingredients
                    camera.openCamera(); // Reopen camera
                  }}
                  onSend={handleSendImage} // Send image for processing
                />
              )}

              {/* Display detected ingredients */}
              {detectedIngredients.length > 0 && (
                <div className="ingredients-container">
                  <h3>Detected Ingredients:</h3>
                  <p>{detectedIngredients.join(", ")}</p>
                </div>
              )}

              {/* Display loading state or recipe cards */}
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
        </div>

        {/* Tab content for "historial" (history) */}
        <div className={`tab-content ${activeTab === "historial" ? "active" : "inactive"}`}>
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
        </div>

        {/* Tab content for "perfil" (profile) */}
        <div className={`tab-content ${activeTab === "perfil" ? "active" : "inactive"}`}>
          {activeTab === "perfil" && (
            <ProfileSettings
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              user={user}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
