import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "../../amplify_outputs.json";
import { Schema } from "../../amplify/data/resource";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
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

export const generateThreeRecipes = async (ingredients: string[]): Promise<string[]> => {
  const responses = await Promise.all(
    [1, 2, 3].map(() =>
      amplifyClient.queries.askBedrock({ ingredients: [...ingredients] })
    )
  );

  return responses.map(res =>
    res.errors ? `Error: ${res.errors.map(e => e.message).join(", ")}` : res.data?.body || "No data"
  );
};
