// TemperatureChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TemperatureChart({ hourly }) {
  if (!hourly) return null;

  // Prepare data for today only
  const today = new Date().toISOString().split("T")[0];
  const data = hourly.time
    .map((t, i) => ({
      time: t.slice(11, 16), // extract HH:MM
      temp: hourly.temperature_2m[i],
      date: t.split("T")[0],
    }))
    .filter((d) => d.date === today);

  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 mt-8 w-full max-w-3xl">
      <h2 className="text-xl font-semibold text-center mb-4">
        🌡️ Today’s Temperature Trend
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#facc15"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
