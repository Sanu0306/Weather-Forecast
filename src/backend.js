export const checkBackend = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/health");

    if (!response.ok) {
      throw new Error("Backend request failed");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Backend connection error:", error);
    throw error;
  }
};
