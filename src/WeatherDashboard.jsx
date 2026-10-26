import React from "react";
import Card from "./Component/Card";
import Input from "./Component/Input";
import Button from "./Component/Button";
import "./App.css";
import { useWeather } from "./Context/Weather";
import HourlyForecast from "./Component/HourlyForecast";
import FiveDayForecast from "./Component/FiveDayForecast";
import BackendTest from "./BackendTest";
import AIChatbot from "./Component/AIChatbot";
import WeatherAdvice from "./Component/WeatherAdvice";
import FavouriteCities from "./Component/FavouriteCities";

import { useAuth } from "./Context/AuthContext";
import { useNavigate } from "react-router-dom";

function WeatherDashboard() {
  const weather = useWeather();

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleSearch = () => {
    if (weather.searchCity?.trim()) {
      weather.fetchData();
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon">🌤️</span>
          <span>
            Weather<span className="brand-accent">Forecast</span>
          </span>
        </div>

        <p>Check the weather around the world</p>

        <div className="header-account">
          <div className="account-info">
            <div className="account-avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="account-details">
              <span className="account-name">{user?.name || "User"}</span>
              <span className="account-label">My Account</span>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      </header>

      <form
        className="search-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <Input />
        <Button type="submit" value="Search" loading={weather.loading} />
      </form>

      <main className="weather-content">
        <Card />

        <FavouriteCities />

        <AIChatbot weather={weather.data} />

        <HourlyForecast />
        <FiveDayForecast />
        <WeatherAdvice />

        {weather.data && (
          <button
            className="refresh-btn"
            onClick={weather.resetWeather}
            type="button"
          >
            ↻ Clear Weather
          </button>
        )}
      </main>

      <BackendTest />

      <footer className="app-footer">
        Weather updates powered by WeatherAPI
      </footer>
    </div>
  );
}

export default WeatherDashboard;
