import React from "react";
import { useWeather } from "../Context/Weather";

const HourlyForecast = () => {
  const { data, unit } = useWeather();

  const hours = data?.forecast?.forecastday?.[0]?.hour;

  if (!hours) return null;

  // Current hour se aage ke agle 8 hours
  const currentTime = data.location.localtime;
  const currentHour = new Date(currentTime.replace(" ", "T")).getHours();

  const upcomingHours = hours
    .filter((item) => {
      const hour = Number(item.time.split(" ")[1].split(":")[0]);
      return hour >= currentHour;
    })
    .slice(0, 8);

  return (
    <section className="forecast-section glass-panel">
      <h2>Hourly Forecast</h2>
      <p className="forecast-subtitle">Weather for the upcoming hours</p>

      <div className="hourly-list">
        {upcomingHours.map((item) => (
          <div className="hourly-item" key={item.time}>
            <p>{item.time.split(" ")[1]}</p>

            <img
              src={`https:${item.condition.icon}`}
              alt={item.condition.text}
            />

            <h3>
              {" "}
              {Math.round(unit === "C" ? item.temp_c : item.temp_f)}°{unit}{" "}
            </h3>
            <p>{item.chance_of_rain}% rain</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HourlyForecast;
