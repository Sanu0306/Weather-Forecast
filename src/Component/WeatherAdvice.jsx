import { useWeather } from "../Context/Weather";

function WeatherAdvice() {
  const { data } = useWeather();

  if (!data || data.error || !data.current || !data.forecast) {
    return null;
  }

  const current = data.current;
  const forecast = data.forecast.forecastday?.[0];
  const today = forecast?.day;
  const astro = forecast?.astro;

  if (!today) return null;

  const rainChance = Number(today.daily_chance_of_rain ?? 0);
  const temperature = current.temp_c;
  const wind = current.wind_kph;

  const insights = [
    {
      icon: "🌧️",
      title: "Rain Insight",
      message:
        rainChance >= 60
          ? `Rain chance is ${rainChance}%. Rain is likely, so consider carrying an umbrella.`
          : rainChance >= 30
            ? `Rain chance is ${rainChance}%. Check the local forecast before outdoor plans.`
            : `Rain chance is ${rainChance}%. Rain is less likely today.`,
    },
    {
      icon: "🌡️",
      title: "Today's Temperature Range",
      message: `Today's forecast ranges from ${today.mintemp_c}°C to ${today.maxtemp_c}°C.`,
    },
    {
      icon: "🌅",
      title: "Golden Hour",
      message:
        astro?.sunrise && astro?.sunset
          ? `Sunrise: ${astro.sunrise} · Sunset: ${astro.sunset}. Plan outdoor walks or photography around daylight hours.`
          : "Sunrise and sunset information is not available for this location.",
    },
  ];

  const advice = [
    {
      icon: "🌂",
      title: "Umbrella Advice",
      message:
        rainChance >= 40
          ? `Rain chance is ${rainChance}%. Carry an umbrella.`
          : `Rain chance is ${rainChance}%. An umbrella may not be necessary.`,
    },
    {
      icon: "👕",
      title: "Clothing Advice",
      message:
        temperature >= 30
          ? "It is warm. Wear light, breathable clothes."
          : temperature <= 15
            ? "It is cool. Consider wearing a warm layer."
            : "The temperature is moderate. Comfortable clothes should work well.",
    },
    {
      icon: "🚶",
      title: "Outdoor Activity",
      message:
        rainChance >= 60
          ? "Rain is likely. Consider an indoor activity."
          : wind >= 30
            ? "Wind is strong. Be careful with outdoor activities."
            : "Current conditions may be suitable for outdoor activities. Check the forecast before leaving.",
    },
  ];

  return (
    <section className="weather-advice">
      <h2>🌤️ Smart Weather Advice</h2>

      <div className="advice-grid">
        {advice.map((item) => (
          <article className="advice-card" key={item.title}>
            <span className="advice-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.message}</p>
          </article>
        ))}
      </div>

      <h2 className="insights-heading">🧠 Smart Weather Insights</h2>

      <div className="advice-grid">
        {insights.map((item) => (
          <article className="advice-card" key={item.title}>
            <span className="advice-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WeatherAdvice;
