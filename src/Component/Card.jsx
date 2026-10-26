import React from "react";
import { useWeather } from "../Context/Weather";

const Card = () => {
  const { data, unit, setUnit, favorites, addFavorite, removeFavorite } =
    useWeather();

  if (!data) {
    return (
      <section className="welcome-card">
        <div className="welcome-icon">🌦️</div>
        <h2>Discover Your Weather</h2>
        <p>Search for any city to see its current weather conditions.</p>
        <div className="welcome-tip">
          ☀️ Temperature · 💧 Humidity · 💨 Wind speed
        </div>
      </section>
    );
  }

  if (data.error) {
    return (
      <section className="welcome-card error-card">
        <div className="welcome-icon">⚠️</div>
        <h2>Oops! Weather not found</h2>
        <p>
          {data.error.message || "Please check the city name and try again."}
        </p>
        <p className="error-tip">💡 Try a city like Bhopal, Delhi or Indore.</p>
      </section>
    );
  }

  const current = data.current;
  const location = data.location;

  if (!current || !location) return null;

  const cityName = location.name;
  const isFavorite = favorites.some(
    (city) => city.toLowerCase() === cityName.toLowerCase(),
  );

  const temperature = unit === "C" ? current.temp_c : current.temp_f;
  const feelsLike = unit === "C" ? current.feelslike_c : current.feelslike_f;

  const handleFavorite = () => {
    if (isFavorite) {
      removeFavorite(cityName);
    } else {
      addFavorite(cityName);
    }
  };

  const details = [
    {
      icon: "🌡️",
      label: "Feels Like",
      value: `${Math.round(feelsLike)}°${unit}`,
    },
    {
      icon: "💧",
      label: "Humidity",
      value: `${current.humidity}%`,
    },
    {
      icon: "💨",
      label: "Wind Speed",
      value: `${current.wind_kph} km/h`,
    },
    {
      icon: "👁️",
      label: "Visibility",
      value: `${current.vis_km} km`,
    },
    {
      icon: "🎚️",
      label: "Pressure",
      value: `${current.pressure_mb} hPa`,
    },
    {
      icon: "☀️",
      label: "UV Index",
      value: current.uv,
    },
  ];

  return (
    <div className="weather-dashboard">
      <section className="weather-card glass-panel">
        <div className="current-weather">
          <div className="location-row">
            <span>📍</span>
            <div>
              <h2>
                {location.name}, {location.country}
              </h2>
              <p>{location.localtime}</p>
            </div>
          </div>

          <div className="weather-card-actions">
            <button
              type="button"
              className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
              onClick={handleFavorite}
              aria-pressed={isFavorite}
            >
              {isFavorite ? "★ Saved" : "☆ Add to Favourites"}
            </button>

            <div className="unit-toggle">
              <button
                type="button"
                className={unit === "C" ? "active" : ""}
                onClick={() => setUnit("C")}
              >
                °C
              </button>

              <button
                type="button"
                className={unit === "F" ? "active" : ""}
                onClick={() => setUnit("F")}
              >
                °F
              </button>
            </div>
          </div>

          <div className="temperature-row">
            <div>
              <h1>
                {Math.round(temperature)}
                <span>°{unit}</span>
              </h1>

              <h3>{current.condition.text}</h3>

              <p>
                Feels like {Math.round(feelsLike)}°{unit}
              </p>
            </div>

            <img
              className="weather-icon"
              src={`https:${current.condition.icon}`}
              alt={current.condition.text}
            />
          </div>
        </div>

        <div className="weather-details">
          {details.map((item) => (
            <div className="detail-tile" key={item.label}>
              <span className="detail-icon">{item.icon}</span>
              <div>
                <p>{item.label}</p>
                <h3>{item.value}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Card;
