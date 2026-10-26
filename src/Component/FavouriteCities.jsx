import React from "react";
import { useWeather } from "../Context/Weather";
import { getWeatherDataForCity } from "../api";

const FavouriteCities = () => {
  const { favorites, removeFavorite, setSearchCity, setData, setLoading } =
    useWeather();

  const handleCityClick = async (city) => {
    setSearchCity(city);
    setLoading(true);

    try {
      const response = await getWeatherDataForCity(city);
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

  if (!favorites || favorites.length === 0) {
    return null;
  }

  return (
    <section className="favourite-cities">
      <h2>⭐ Favourite Cities</h2>

      <div className="favourite-city-list">
        {favorites.map((city) => (
          <div className="favourite-city-item" key={city}>
            <button
              type="button"
              className="favourite-city-name"
              onClick={() => handleCityClick(city)}
            >
              📍 {city}
            </button>

            <button
              type="button"
              className="remove-favourite"
              onClick={() => removeFavorite(city)}
              aria-label={`Remove ${city} from favourites`}
              title="Remove favourite"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FavouriteCities;
