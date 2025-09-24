import { useState } from "react";
import TemperatureChart from "./components/TemperatureChart";
import { CalendarDays, MapPin, WindArrowDown } from "lucide-react";
import { WiHumidity } from "react-icons/wi";
import { days, months } from "./utils/data.js";
import { weatherCodes } from "./utils/weatherCodes.jsx";

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
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
  {/* Title */}
  <h1 className="mx-0 sm:mx-4 font-semibold text-xl sm:text-md text-center sm:text-left text-transparent bg-clip-text 
      bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 
      bg-[length:200%_200%] animate-gradient-x">
    Weather Now
  </h1>

  {/* Search bar */}
  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
    <input
      type="text"
      placeholder="Enter city..."
      value={city}
      onChange={(e) => setCity(e.target.value)}
      className="px-4 py-2 rounded-lg text-white outline-none border border-gray-600  flex-1"
    />
    <button
      onClick={fetchWeather}
      className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold"
    >
      Search
    </button>
  </div>
   </div>


      {loading && (
        <div className="text-2xl text-green-600 font-semibold flex justify-center items-center w-full h-[55vh] p-15">
          Loading....
        </div>
      )}

      {!loading && (
        <div className="p-4 w-full">
          <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Weather Card */}
            {weather && (
              <div
                className="mt-8 p-6 rounded-2xl shadow-lg backdrop-blur-lg 
        text-center w-full max-w-md sm:max-w-lg lg:max-w-xl h-auto mx-auto border-t-2 border-b-2"
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
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-2">
                  <MapPin className="text-base sm:text-lg text-red-500" />
                  <h2 className="text-base sm:text-lg font-semibold text-center sm:text-left">
                    {weather.city}, {weather.country}
                  </h2>
                </div>

                {/* Temperature */}
                <p className="text-4xl sm:text-5xl md:text-8xl font-semibold  mt-3">
                  {weather.temperature}<sup>&deg;</sup>C
                </p>

                <div className="flex justify-center my-2">
                  <span className="text-lg">
                    {" "}
                    {weatherCodes[weather.weathercode]?.icon || "unknown"}
                  </span>
                  <span className="text-lg">
                    {weatherCodes[weather.weathercode]?.label || "Unknown"}
                  </span>
                </div>

                {/* Extra info */}
                <div className="flex flex-col sm:flex-row justify-around mt-5 text-sm gap-6 sm:gap-0">
                  <div className="flex flex-col items-center">
                    <p className="flex justify-between items-center gap-1">
                      <WiHumidity className="text-lg sm:text-xl" />
                      <span>Humidity</span>
                    </p>
                    <span className="text-xl sm:text-2xl md:text-3xl">
                      {humidity ?? "--"}%
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="flex justify-between items-center gap-1">
                      <WindArrowDown className="text-lg sm:text-xl" />
                      <span>Wind</span>
                    </p>
                    <span className="text-xl sm:text-2xl md:text-3xl">
                      {weather.windspeed} km/h
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Forecast Section */}
            {forecast && (
              <div className="mt-10 grid grid-cols-1 gap-2 w-full max-w-md border border-gray-200 rounded-xl p-2 shadow-lg shadow-gray-900">
                {forecast.time.slice(1, 7).map((day, i) => (
                  <div
                    key={i}
                    className="p-3 text-center backdrop-blur-lg flex justify-between items-center hover:border-l-2 border-yellow-600"
                  >
                    {/* Icon */}
                    <span className="text-3xl">
                      {weatherCodes[forecast.weathercode[i + 1]]?.icon || "❓"}
                    </span>

                    {/* Day + Condition */}
                    <div className="flex flex-col items-center">
                      <p className="font-semibold">
                        {new Date(day).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </p>
                      <p className="text-xs text-center text-gray-200">
                        {weatherCodes[forecast.weathercode[i + 1]]?.label ||
                          "Unknown"}
                      </p>
                    </div>

                    {/* Temperature */}
                    <p className="font-semibold">
                      {forecast.temperature_2m_min[i + 1]}° /{" "}
                      {forecast.temperature_2m_max[i + 1]}°
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hourly Chart */}
          <div className="mt-12 w-full flex justify-center">
      {hourly && (
    <div className="w-full max-w-4xl backdrop-blur-md rounded-2xl shadow-lg p-6">

      <TemperatureChart hourly={hourly} />
    </div>
  )}
</div>

        </div>
      )}
    </div>
  );
}
