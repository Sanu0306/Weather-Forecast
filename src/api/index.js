const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const getWeatherDataForCity = async (city) => {
  if (!API_KEY) {
    throw new Error("Weather API key is missing. Check your .env file.");
  }

  const url = new URL("https://api.weatherapi.com/v1/forecast.json");

  url.searchParams.set("key", API_KEY);
  url.searchParams.set("q", city.trim());
  url.searchParams.set("days", "3");
  url.searchParams.set("aqi", "yes");
  url.searchParams.set("alerts", "no");

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Unable to fetch weather data.");
    }

    console.log("API forecast days:", result.forecast?.forecastday?.length);

    return result;
  } catch (error) {
    console.error("Weather API error:", error);
    throw error;
  }
};
