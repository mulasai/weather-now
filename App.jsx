import React, { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    try {
      setError("");
      setWeather(null);

      // Get coordinates from city name
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Get weather using coordinates
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        city: name,
        country,
        temperature: weatherData.current_weather.temperature,
        wind: weatherData.current_weather.windspeed,
      });
    } catch {
      setError("Failed to fetch weather");
    }
  };

  return (
    <div className="app">
      <h1>Weather Finder</h1>
      <div className="search">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>
      {error && <p className="error">{error}</p>}
      {weather && (
        <div className="card">
          <h2>{weather.city}, {weather.country}</h2>
          <p>🌡️ Temperature: {weather.temperature} °C</p>
          <p>💨 Wind Speed: {weather.wind} km/h</p>
        </div>
      )}
    </div>
  );
}

export default App;
