import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "../../amplify_outputs.json";
import { Schema } from "../../amplify/data/resource";
import { GoogleGenerativeAI } from "@google/generative-ai";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "apiKey",
});

/**
 * Generates three recipes based on the provided ingredients by making asynchronous requests.
 *
 * @param ingredients - An array of strings representing the ingredients to be used for generating recipes.
 * @returns A promise that resolves to an array of strings. Each string represents either:
 * - A recipe generated from the provided ingredients.
 * - An error message if the request fails.
 *
 * The function performs the following steps:
 * 1. Sends three parallel requests to the `amplifyClient.queries.askBedrock` method with the provided ingredients.
 * 2. Waits for all requests to complete using `Promise.all`.
 * 3. Maps the responses to extract either the recipe data or an error message.
 *
 * Example response:
 * - If successful: `["Recipe 1", "Recipe 2", "Recipe 3"]`
 * - If errors occur: `["Error: Error message 1", "Error: Error message 2", "Error: Error message 3"]`
 */

const GEMINI_API_KEY = "AIzaSyBw2wTugGl8EmOkFpwvFsDQ1JdHC36L7SY"; // <-- DANGER

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const getSingleRecipe = async (ingredients: string[]): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `Generate a creative recipe using these ingredients: ${ingredients.join(", ")}.
Return only the recipe title, ingredients, and instructions clearly formatted.
Please do not use any markdown formatting like asterisks for bolding or bullet points.`;
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text.trim();
};

/**
 * Generates three recipes by making parallel, insecure requests directly to the Gemini API.
 *
 * @param ingredients - An array of strings representing the ingredients.
 * @returns A promise that resolves to an array of recipe strings or error messages.
 */
export const generateThreeRecipes = async (ingredients: string[]): Promise<string[]> => {

  try {
    // Create an array of 3 promises to run in parallel
    const recipePromises = [
      getSingleRecipe(ingredients),
      getSingleRecipe(ingredients),
      getSingleRecipe(ingredients),
    ];

    // Wait for all 3 promises to resolve
    const responses = await Promise.allSettled(recipePromises);

    // Map over the results
    const recipes = responses.map((res) => {
      if (res.status === "fulfilled") {
        return res.value; // This is the recipe text
      } else {
        // The promise was rejected (an error occurred)
        console.error("Gemini API call failed:", res.reason);
        return "Error generating recipe.";
      }
    });

    console.log(recipes);
    return recipes;

  } catch (error) {
    console.error("Error generating recipes:", error);
    return ["Error generating recipes.", "Check console for details."];
  }
};


