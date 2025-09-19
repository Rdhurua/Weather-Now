import { useState} from "react";
import TemperatureChart from "./components/TemperatureChart";
import { CalendarDays, MapPin, WindArrowDown } from "lucide-react";
import { WiHumidity } from "react-icons/wi";
import {days,months,weatherCodes} from './utils/data.js'




export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [hourly, setHourly] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    try {
      if (!city) return;
      setLoading(true);
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );

      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        alert("City not found!");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode&hourly=temperature_2m,relativehumidity_2m&timezone=auto`
      );

      const weatherData = await weatherRes.json();

      setWeather({
        city: name,
        country,
        ...weatherData.current_weather,
      });

      setForecast(weatherData.daily);
      setHourly(weatherData.hourly);

      // 3. Find humidity for the current local hour
      const nowHour = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
      const idx = weatherData.hourly.time.findIndex((t) =>
        t.startsWith(nowHour)
      );

      if (idx !== -1) {
        setHumidity(weatherData.hourly.relativehumidity_2m[idx]);
      }

    } catch (error) {
      console.error("error at getting data", error.message);
    } finally {
      setLoading(false);
    }
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

      {loading && (
        <div className="text-2xl text-orange-600 font-semibold flex justify-center items-center w-full h-[55vh] p-15">
          Loading....
        </div>
      )}

    { !loading && <div className="p-10">
        {weather && (
          <div
            className="mt-8 p-6 bg-white/20 rounded-2xl shadow-lg backdrop-blur-lg 
                text-center w-full max-w-md sm:max-w-lg lg:max-w-xl h-auto mx-auto"
          >
            {/* Date */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-1">
              <CalendarDays className="text-sm sm:text-base" />
              <p className="text-base sm:text-lg mt-1 sm:mt-0">
                {days[new Date().getDay()]}, {months[new Date().getMonth()]}{" "}
                {new Date().getDate()}
              </p>
            </div>

            {/* Location */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-1 mt-2">
              <MapPin className="text-base sm:text-lg" />
              <h2 className="text-base sm:text-lg font-semibold text-center sm:text-left">
                {weather.city}, {weather.country}
              </h2>
            </div>

            {/* Temperature */}
            <p className="text-4xl sm:text-5xl md:text-6xl font-bold mt-3">
              {weather.temperature}°C
            </p>

            {/* Weather condition */}
            <p className="text-base sm:text-lg mt-2">
              {weatherCodes[weather.weathercode] || "Unknown"}
            </p>

            {/* Extra info */}
            <div className="flex flex-col sm:flex-row justify-around mt-5 text-sm gap-4 sm:gap-0">
              <div className="flex flex-col items-center">
                <p className="flex justify-between">
                  {" "}
                  <WiHumidity className="text-lg sm:text-xl" />
                  <span>Humidity</span>
                </p>
                <span className="text-xl sm:text-2xl md:text-3xl">
                  {humidity ?? "--"}%
                </span>
              </div>
              <div className="flex flex-col items-center">
                <p className="flex justify-between">
                  <WindArrowDown className="text-lg sm:text-xl" />{" "}
                  <span>Wind</span>
                </p>
                <span className="text-xl sm:text-2xl md:text-3xl">
                  {weather.windspeed} km/h
                </span>
              </div>
            </div>
          </div>
        )}

        {hourly && <TemperatureChart hourly={hourly} />}

        {/* 10-Day Forecast */}
        {forecast && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-4 w-full max-w-4xl">
            {forecast.time.map((day, i) => (
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
                <p className="text-xs">
                  💨 {forecast.windspeed_10m_max[i]} km/h
                </p>
              </div>
            ))}
          </div>
        )}
      </div>}



    </div>
  );
}
