
import {
  WiDaySunny,
  WiDayCloudy,
  WiCloud,
  WiFog,
  WiDayShowers,
  WiDayRain,
  WiDayThunderstorm,
  WiDaySnow,
  WiSnowflakeCold,
  WiRainMix,
  WiNightAltSnowThunderstorm,
} from "react-icons/wi";
import { IoThunderstormOutline } from "react-icons/io5";

export const weatherCodes = {
  // Clear & Cloudy
  0: { label: "Clear sky", icon: <WiDaySunny className="text-3xl text-yellow-400" /> },
  1: { label: "Mainly clear", icon: <WiDayCloudy className="text-3xl text-yellow-300" /> },
  2: { label: "Partly cloudy", icon: <WiDayCloudy className="text-3xl text-gray-300" /> },
  3: { label: "Overcast", icon: <WiCloud className="text-3xl text-gray-400" /> },

  // Fog
  45: { label: "Fog", icon: <WiFog className="text-3xl text-gray-400" /> },
  48: { label: "Rime fog", icon: <WiFog className="text-3xl text-gray-400" /> },

  // Drizzle
  51: { label: "Light drizzle", icon: <WiDayShowers className="text-3xl text-blue-300" /> },
  53: { label: "Moderate drizzle", icon: <WiDayShowers className="text-3xl text-blue-400" /> },
  55: { label: "Dense drizzle", icon: <WiDayRain className="text-3xl text-blue-500" /> },

  // Freezing Drizzle
  56: { label: "Light freezing drizzle", icon: <WiRainMix className="text-3xl text-cyan-400" /> },
  57: { label: "Dense freezing drizzle", icon: <WiRainMix className="text-3xl text-cyan-500" /> },

  // Rain
  61: { label: "Slight rain", icon: <WiDayRain className="text-3xl text-blue-400" /> },
  63: { label: "Moderate rain", icon: <WiDayRain className="text-3xl text-blue-500" /> },
  65: { label: "Heavy rain", icon: <WiDayRain className="text-3xl text-blue-700" /> },

  // Freezing Rain
  66: { label: "Light freezing rain", icon: <WiRainMix className="text-3xl text-cyan-400" /> },
  67: { label: "Heavy freezing rain", icon: <WiRainMix className="text-3xl text-cyan-600" /> },

  // Snowfall
  71: { label: "Slight snow", icon: <WiDaySnow className="text-3xl text-blue-200" /> },
  73: { label: "Moderate snow", icon: <WiDaySnow className="text-3xl text-blue-300" /> },
  75: { label: "Heavy snow", icon: <WiDaySnow className="text-3xl text-blue-500" /> },

  // Snow Grains
  77: { label: "Snow grains", icon: <WiSnowflakeCold className="text-3xl text-blue-300" /> },

  // Showers
  80: { label: "Light rain showers", icon: <WiDayShowers className="text-3xl text-blue-300" /> },
  81: { label: "Moderate rain showers", icon: <WiDayShowers className="text-3xl text-blue-400" /> },
  82: { label: "Violent rain showers", icon: <WiDayRain className="text-3xl text-blue-700" /> },

  // Snow Showers
  85: { label: "Light snow showers", icon: <WiDaySnow className="text-3xl text-blue-200" /> },
  86: { label: "Heavy snow showers", icon: <WiDaySnow className="text-3xl text-blue-500" /> },

  // Thunderstorms
  95: { label: "Thunderstorm", icon: <IoThunderstormOutline className="text-3xl text-yellow-400" /> },
  96: { label: "Thunderstorm with hail", icon: <WiNightAltSnowThunderstorm className="text-3xl text-gray-400" /> },
  99: { label: "Thunderstorm with heavy hail", icon: <WiNightAltSnowThunderstorm className="text-3xl text-blue-500" /> },
};