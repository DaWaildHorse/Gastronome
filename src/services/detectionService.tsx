/**
 * Detects ingredients from an image by sending it to a remote prediction service.
 *
 * @param base64Image - A base64-encoded string representation of the image to be analyzed.
 * @returns A promise that resolves to an array of detected ingredient names.
 * @throws Will throw an error if the response from the prediction service is not successful.
 */
export const detectIngredientsFromImage = async (base64Image: string): Promise<string[]> => {
  // Fetch the image data from the base64 string and convert it to a Blob object
  const res = await fetch(base64Image);
  const blob = await res.blob();

  // Create a FormData object and append the image Blob with a filename
  const formData = new FormData();
  formData.append("image", blob, "captured.png");

  // Send the image to the prediction service via a POST request paste IP address here with endpoint
  const response = await fetch("", {
    method: "POST", // HTTP POST method
    body: formData, // Form data containing the image
  });

  // Parse the JSON response from the server
  const data = await response.json();

  // Throw an error if the response status is not OK
  if (!response.ok) throw new Error(data.error || "Unknown error");

  // Return the predictions from the response
  return data.predictions;
};