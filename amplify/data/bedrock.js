import { GoogleGenerativeAI } from "@google/generative-ai";
import secret  from "@aws-amplify/backend";

const genAI = new GoogleGenerativeAI(secret("GEMINI_API_KEY"));

export const request = async (ctx) => {
  const { ingredients = [] } = ctx.args;
  const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.
Please include only:
- Recipe name
- Ingredients
- Instructions`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return { body: text, error: "" };
  } catch (err) {
    console.error("Gemini API error:", err);
    return { body: "", error: err.message || "Gemini request failed" };
  }
};
