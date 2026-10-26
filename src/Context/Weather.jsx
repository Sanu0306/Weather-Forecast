import { createContext, useContext, useState, useEffect } from "react";
import { getWeatherDataForCity } from "../api";

export const WeatherContext = createContext(null);

export const useWeather = () => useContext(WeatherContext);

export const Weatherprovider = ({ children }) => {
  const [data, setData] = useState(null);
  const [unit, setUnit] = useState("C");
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(false);

  // Favourite cities load from localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem("favoriteCities");
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch {
      return [];
    }
  });

  // Save favourite cities whenever the list changes
  useEffect(() => {
    localStorage.setItem("favoriteCities", JSON.stringify(favorites));
  }, [favorites]);

  // Add a city to favourites
  const addFavorite = (city) => {
    const cityName = city?.trim();

    if (!cityName) return;

    setFavorites((prev) => {
      const alreadyExists = prev.some(
        (item) => item.toLowerCase() === cityName.toLowerCase(),
      );

      return alreadyExists ? prev : [...prev, cityName];
    });
  };

  // Remove a city from favourites
  const removeFavorite = (city) => {
    setFavorites((prev) =>
      prev.filter((item) => item.toLowerCase() !== city.toLowerCase()),
    );
  };

  const fetchData = async () => {
    if (!searchCity.trim()) return;

    setLoading(true);

    try {
      const response = await getWeatherDataForCity(searchCity);
      setData(response);
    } catch (error) {
      setData({
        error: {
          message: error.message || "Unable to fetch weather data.",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const resetWeather = () => {
    setData(null);
    setSearchCity("");
  };

  return (
    <WeatherContext.Provider
      value={{
        searchCity,
        setSearchCity,
        data,
        loading,
        fetchData,
        resetWeather,
        unit,
        setUnit,
        favorites,
        addFavorite,
        removeFavorite,
        setData,
        setLoading,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
