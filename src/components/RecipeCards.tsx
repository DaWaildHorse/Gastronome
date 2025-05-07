import React from "react";

interface RecipeCardsProps {
  recipes: string[];
  images: string[];
  types: { title: string; description: string }[];
}

const RecipeCards: React.FC<RecipeCardsProps> = ({ recipes, images, types }) => {
  return (
    <div className="recipe-cards-container">
      {recipes.map((recipe, index) => {
        const title = types[index]?.title || `Recipe ${index + 1}`;
        const imageUrl = images[index];

        // Extract from "Ingredients:" onward
        const ingredientsMatch = recipe.match(/Ingredients:.*/s);
        const ingredientsSection = ingredientsMatch?.[0] || recipe; // fallback to full recipe

        return (
          <div key={index} className="recipe-card">
            <div className="recipe-card-image">
              <img src={imageUrl} alt={title} />
            </div>
            <div className="recipe-card-content">
              <h3 className="recipe-card-title">{title}</h3>
              <div className="recipe-card-text">{ingredientsSection}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecipeCards;
