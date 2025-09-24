// TemperatureChart.jsx
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TemperatureChart({ hourly }) {
  // Prepare data only when hourly is valid
  const data = useMemo(() => {
    if (
      !hourly ||
      !Array.isArray(hourly.time) ||
      !Array.isArray(hourly.temperature_2m)
    ) {
      return [];
    }

    const today = new Date().toISOString().split("T")[0];

    const len = Math.min(hourly.time.length, hourly.temperature_2m.length);
    const out = [];

    for (let i = 0; i < len; i++) {
      const iso = hourly.time[i];
      if (!iso) continue;
      const [date, time] = iso.split("T");
      if (date === today) {
        out.push({
          time: (time || "").slice(0, 5), // HH:MM
          temp: hourly.temperature_2m[i],
        });
      }
    }

    return out;
  }, [hourly]);

  // Defensive UI for missing/empty data
  if (!hourly) {
    return (
      <div className="p-4 bg-white/10 rounded-lg text-center text-sm">
        Loading hourly data...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-4 bg-white/10 rounded-lg text-center text-sm">
        No hourly temperature data available for today.
      </div>
    );
  }

  return (
    <div className=" backdrop-blur-lg rounded-xl p-4 mt-8 w-full max-w-3xl">
      <h2 className="text-xl font-semibold text-center mb-4">
       Temperature Status
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} className="text-white">
          <XAxis dataKey="time" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#facc15" }}
            itemStyle={{ color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#facc15"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
