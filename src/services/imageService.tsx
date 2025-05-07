// src/services/imageService.ts
const UNSPLASH_ACCESS_KEY = "PyX3uZI3gsH3fOkmbgenQ2Nnxc3aNg_-SggyQgShJh0";

export const getUnsplashImageForRecipe = async (query: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status} ${response.statusText}`);
      return "/fallback.jpg";
    }

    const data = await response.json();
    const imageUrl = data.results?.[0]?.urls?.regular;
    return imageUrl || "/fallback.jpg";
  } catch (error) {
    console.error("Failed to fetch image from Unsplash:", error);
    return "/fallback.jpg";
  }
};
