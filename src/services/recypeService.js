import { GoogleGenerativeAI } from "@google/generative-ai";
import secret  from "@aws-amplify/backend";

// Initialize Gemini with your API key (from .env)
const genAI = new GoogleGenerativeAI(secret("GEMINI_API_KEY"));

/**
 * Generates three creative recipes using the provided ingredients.
 * @param {string[]} ingredients - The list of ingredients.
 * @returns {Promise<string[]>} - Array of recipe strings.
 */
export const generateThreeRecipes = async (ingredients) => {
  try {
    const prompt = `Generate a creative recipe using these ingredients: ${ingredients.join(", ")}.
Return only the recipe title, ingredients, and instructions clearly formatted.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Run 3 calls in parallel
    const responses = await Promise.all(
      [1, 2, 3].map(async () => {
        const result = await model.generateContent(prompt);
        return result.response.text();
      })
    );

    return responses;
  } catch (err) {
    console.error("Error calling Gemini API:", err);
    throw err;
  }
};
