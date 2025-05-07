import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "../../amplify_outputs.json";
import { Schema } from "../../amplify/data/resource";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

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
