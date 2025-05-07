import React from "react";

interface RecipeCardProps {
  recipes: string[];
  types: { title: string; description: string; imageUrl: string }[];
}

const RecipeCards: React.FC<RecipeCardProps> = ({ recipes, types }) => (
  <div className="recipe-cards-container">
    {recipes.map((recipe, index) => (
      <div key={index} className="recipe-card">
        <div className="recipe-card-image">
          <img src={types[index]?.imageUrl} alt={types[index]?.title} />
        </div>
        <div className="recipe-card-content">
          <h3 className="recipe-card-title">{types[index]?.title}</h3>
          <div className="recipe-card-text">{recipe}</div>
        </div>
      </div>
    ))}
  </div>
);

export default RecipeCards;
