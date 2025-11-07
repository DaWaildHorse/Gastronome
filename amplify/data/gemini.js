import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSecret } from "@aws-amplify/backend";

/**
 * A more robust handler for the askGemini query.
 * Includes detailed logging and specific error handling for missing secrets.
 */
export const handler = async (event) => {
  console.log("Handler started. Received event:", JSON.stringify(event, null, 2));

  try {
    // 1. Validate Ingredients
    const ingredients = event.arguments?.ingredients || [];
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      console.warn("Validation failed: No ingredients provided.");
      return {
        body: "",
        error: "Please provide a list of ingredients.",
      };
    }
    console.log(`Processing ${ingredients.length} ingredients:`, ingredients.join(", "));

    // 2. Securely Get the API Key (The most critical part)
    console.log("Attempting to fetch 'GEMINI_API_KEY' from secrets...");
    const GEMINI_API_KEY = await getSecret("GEMINI_API_KEY");

    // 3. CRITICAL CHECK: Verify the key exists
    if (!GEMINI_API_KEY) {
      console.error("FATAL: 'GEMINI_API_KEY' secret was not found or is empty.");
      // This throws a clear error that you will see in the client
      throw new Error(
        "GEMINI_API_KEY is not set in the Amplify environment. Please run 'amplify sandbox secret set GEMINI_API_KEY' in your terminal and try again."
      );
    }
    console.log("Successfully fetched secret.");

    // 4. Initialize the Gemini Client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 5. Create the Prompt
    const prompt = `Generate a creative recipe using these ingredients: ${ingredients.join(", ")}.
Return only the recipe title, ingredients, and instructions clearly formatted.`;

    // 6. Call the API and get the response
    console.log("Sending prompt to Gemini...");
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("Successfully received response from Gemini.");
    return { body: text, error: "" };

  } catch (error) {
    // 7. Catch-all Error Handling
    console.error("An error occurred during the handler execution:", error);
    // Send the specific error message back to the client
    return { body: "", error: error.message || "An unknown server error occurred." };
  }
};