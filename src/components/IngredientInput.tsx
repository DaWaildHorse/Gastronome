import React, { FormEvent, useState } from "react";

interface Props {
  onSubmit: (ingredients: string[]) => void;
}

const IngredientsInput: React.FC<Props> = ({ onSubmit }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ingredients = input.split(",").map(i => i.trim()).filter(Boolean);
    onSubmit(ingredients);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="search-container">
        <input
          type="text"
          className="wide-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ingredient1, Ingredient2, etc"
        />
        <button type="submit" className="search-button">Generate</button>
      </div>
    </form>
  );
};

export default IngredientsInput;
