const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const checkBackend = async () => {
  try {
    const response = await fetch(`${API_URL}/api/health`);

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
