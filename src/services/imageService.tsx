// src/services/imageService.ts

// The Unsplash API access key. This should be set to a valid key for the API to work.
// Currently, it's an empty string, so the API calls will fail unless updated.
const UNSPLASH_ACCESS_KEY = "";

/**
 * Fetches an image URL from Unsplash based on a given query.
 * If the API call fails or no image is found, a fallback image URL is returned.
 *
 * @param query - The search term to query Unsplash for images.
 * @returns A promise that resolves to the URL of the image or a fallback image URL.
 */
export const getUnsplashImageForRecipe = async (query: string): Promise<string> => {
  try {
    // Construct the Unsplash API URL with the query, orientation, and access key.
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    // Check if the response from the API is not successful (status code not in the 200 range).
    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status} ${response.statusText}`);
      // Return a fallback image URL if the API call fails.
      return "/fallback.jpg";
    }

    // Parse the JSON response from the API.
    const data = await response.json();

    // Extract the URL of the first image result, if available.
    const imageUrl = data.results?.[0]?.urls?.regular;

    // Return the image URL if found, otherwise return the fallback image URL.
    return imageUrl || "/fallback.jpg";
  } catch (error) {
    // Log any errors that occur during the fetch or processing of the API response.
    console.error("Failed to fetch image from Unsplash:", error);
    // Return the fallback image URL in case of an error.
    return "/fallback.jpg";
  }
};
