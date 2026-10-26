import React from "react";
import { useWeather } from "../Context/Weather";

const FiveDayForecast = () => {
  const { data, unit } = useWeather();

  const forecastDays = data?.forecast?.forecastday;
  console.log("Forecast days:", forecastDays?.length, forecastDays);

  if (!forecastDays || forecastDays.length === 0) {
    return null;
  }

  return (
    <section className="forecast-section glass-panel">
      <h2>3-Day Forecast</h2>
      <p className="forecast-subtitle">
        Weather outlook for the next five days
      </p>

      <div className="five-day-list">
        {forecastDays.map((day) => (
          <div className="five-day-item" key={day.date}>
            <h3>
              {new Date(`${day.date}T12:00:00`).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </h3>

            <p className="forecast-date">{day.date}</p>

            <img
              src={`https:${day.day.condition.icon}`}
              alt={day.day.condition.text}
            />

            <p>{day.day.condition.text}</p>

            <h3>
              {Math.round(unit === "C" ? day.day.avgtemp_c : day.day.avgtemp_f)}
              °{unit}
            </h3>

            <p>
              H:{" "}
              {Math.round(unit === "C" ? day.day.maxtemp_c : day.day.maxtemp_f)}
              ° · L:{" "}
              {Math.round(unit === "C" ? day.day.mintemp_c : day.day.mintemp_f)}
              °
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FiveDayForecast;
