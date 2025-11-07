import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSecret } from "@aws-amplify/backend";

export const handler = async (event) => {
  try {
    console.log("Event received:", JSON.stringify(event, null, 2));

    // Extract ingredients safely
    const ingredients = event.arguments?.ingredients || [];
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error("No ingredients provided");
    }

    // Get your Gemini API key stored as a secret in Amplify
    const GEMINI_API_KEY = await getSecret("GEMINI_API_KEY");
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const prompt = `Generate a creative recipe using these ingredients: ${ingredients.join(", ")}.
Return only the recipe title, ingredients, and instructions clearly formatted.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return { body: text, error: "" };
  } catch (error) {
    console.error("Error in gemini.js:", error);
    return { body: "", error: error.message };
  }
};
