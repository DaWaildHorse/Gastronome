export const detectIngredientsFromImage = async (base64Image: string): Promise<string[]> => {
    const res = await fetch(base64Image);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append("image", blob, "captured.png");
  
    const response = await fetch("http://100.24.6.215:5000/predict", {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unknown error");
    return data.predictions;
  };
  