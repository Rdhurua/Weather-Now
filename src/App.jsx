// App.jsx
import { useState } from "react";
import TemperatureChart from "./components/TemperatureChart";

const weatherCodes = {
  // Clear & Cloudy
  0: "Clear sky ☀️",
  1: "Mainly clear 🌤️",
  2: "Partly cloudy ⛅",
  3: "Overcast ☁️",

  // Fog
  45: "Fog 🌫️",
  48: "Rime fog 🌫️",

  // Drizzle
  51: "Light drizzle 🌦️",
  53: "Moderate drizzle 🌦️",
  55: "Dense drizzle 🌧️",

  // Freezing Drizzle
  56: "Light freezing drizzle ❄️🌦️",
  57: "Dense freezing drizzle ❄️🌧️",

  // Rain
  61: "Slight rain 🌧️",
  63: "Moderate rain 🌧️",
  65: "Heavy rain 🌧️🌊",

  // Freezing Rain
  66: "Light freezing rain ❄️🌧️",
  67: "Heavy freezing rain ❄️🌧️",

  // Snowfall
  71: "Slight snow 🌨️",
  73: "Moderate snow 🌨️",
  75: "Heavy snow ❄️🌨️",

  // Snow Grains
  77: "Snow grains 🌨️",

  // Showers
  80: "Light rain showers 🌦️",
  81: "Moderate rain showers 🌧️",
  82: "Violent rain showers 🌧️⚡",

  // Snow Showers
  85: "Light snow showers 🌨️",
  86: "Heavy snow showers ❄️🌨️",

  // Thunderstorms
  95: "Thunderstorm ⛈️",
  96: "Thunderstorm with hail ⛈️❄️",
  99: "Thunderstorm with heavy hail ⛈️❄️⚡",
};


export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [hourly,setHourly]=useState(null);
  const fetchWeather = async () => {
    if (!city) return;

    // 1. Get city → lat/lon
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      alert("City not found!");
      return;
    }
    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Get current weather + daily + humidity
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode&hourly=relativehumidity_2m&timezone=auto`
    );
    const weatherData = await weatherRes.json();

    setWeather({
      city: name,
      country,
      ...weatherData.current_weather,
    });

    setForecast(await weatherData.daily);
    console.log(await weatherData.daily);
    setHourly(weatherData.hourly);

    // 3. Get humidity of current hour
    const currentHour = new Date().getHours();
    setHumidity(weatherData.hourly.relativehumidity_2m[currentHour]);
  };

  return (
    <div className="flex flex-col items-center min-h-screen  text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🌦️ Weather App</h1>

      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 rounded-lg text-white outline-yellow-300"
        />
        <button
          onClick={fetchWeather}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Search
        </button>
      </div>

      {/* Current Weather */}
      {weather && (
        <div className="mt-8 p-6 bg-white/20 rounded-2xl shadow-lg backdrop-blur-lg text-center w-full max-w-md">
          <h2 className="text-2xl font-semibold">
            {weather.city}, {weather.country}
          </h2>
          <p className="text-5xl font-bold mt-2">{weather.temperature}°C</p>
          <p className="text-lg mt-2">
            {weatherCodes[weather.weathercode] || "Unknown"}
          </p>
          <div className="flex justify-around mt-4 text-sm">
            <p>💧 Humidity: {humidity}%</p>
            <p>💨 Wind: {weather.windspeed} km/h</p>
          </div>
          <p className="text-xs mt-2">⏰ {weather.time}</p>
        </div>
      )}

<TemperatureChart hourly={hourly}/>
      {/* 10-Day Forecast */}
      {forecast && (
        
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-4 w-full max-w-4xl">
          {
          
          forecast.time.map((day, i) => (
            <div
              key={i}
              className="p-4 bg-white/20 rounded-xl text-center backdrop-blur-lg"
            >
              <p className="font-semibold">
                {new Date(day).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </p>
              <p className="text-sm mt-1">
                {weatherCodes[forecast.weathercode[i]] || "❓"}
              </p>
              <p className="mt-2">
                🌡️ {forecast.temperature_2m_min[i]}° /{" "}
                {forecast.temperature_2m_max[i]}°
              </p>
              <p className="text-xs mt-1">
                💧 {forecast.precipitation_sum[i]} mm
              </p>
              <p className="text-xs">💨 {forecast.windspeed_10m_max[i]} km/h</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
