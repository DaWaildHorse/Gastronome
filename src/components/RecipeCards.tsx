import React from "react";

interface RecipeCardsProps {
  recipes: string[];
  images: string[];
  types: { title: string; description: string }[]; // Keeping this prop, but title logic is changed
}

const RecipeCards: React.FC<RecipeCardsProps> = ({ recipes, images, types }) => {
  return (
    <div className="recipe-cards-container">
      {recipes.map((recipe, index) => {
        // --- START FIX ---

        // 1. Parse the title from the recipe string
        let title = `Recipe ${index + 1}`; // Default title
        const firstLine = recipe.split('\n')[0]; // Get the first line

        if (firstLine) {
          // Clean markdown (like **) and extra spaces
          title = firstLine.replace(/\*/g, '').trim();
        }

        // 2. Use the provided image
        const imageUrl = images[index];

        // 3. Extract from "Ingredients:" onward (your existing logic)
        const ingredientsMatch = recipe.match(/Ingredients:.*/s);
        // Fallback to the full recipe string if "Ingredients:" isn't found
        const ingredientsSection = ingredientsMatch?.[0] || recipe; 

        // --- END FIX ---

        return (
          <div key={index} className="recipe-card">
            <div className="recipe-card-image">
              <img src={imageUrl} alt={title} />
            </div>
            <div className="recipe-card-content">
              {/* Use the new parsed title */}
              <h3 className="recipe-card-title">{title}</h3>
              {/* Render ingredients with line breaks preserved */}
              <div className="recipe-card-text" style={{ whiteSpace: 'pre-wrap' }}>
                {ingredientsSection}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecipeCards;