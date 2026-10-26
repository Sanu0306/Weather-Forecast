import React from "react";
import { useWeather } from "../Context/Weather";

const Input = () => {
  const weather = useWeather();

  return (
    <input
      className="input-field"
      type="text"
      value={weather.searchCity ?? ""}
      placeholder="Enter city name (e.g. Bhopal, Delhi)"
      aria-label="Search city"
      onChange={(e) => weather.setSearchCity(e.target.value)}
    />
  );
};

export default Input;
