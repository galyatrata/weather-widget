import posthog from 'posthog-js';
import { useState, useEffect, useCallback } from "react";

const API_KEY = "1db8f4ef7728eec5eefb7ec63429363d"; 

const WEATHER_BACKGROUNDS = {
  Clear: { day: ["#FF6B35", "#F7931E", "#FFD23F"], night: ["#0F0C29", "#302B63", "#24243e"] },
  Clouds: { day: ["#757F9A", "#D7DDE8", "#a8c0cc"], night: ["#1a1a2e", "#16213e", "#4a4a6a"] },
  Rain: { day: ["#373B44", "#4286f4", "#373B44"], night: ["#0f2027", "#203a43", "#2c5364"] },
  Drizzle: { day: ["#4CA1AF", "#2C3E50", "#4CA1AF"], night: ["#1a1a2e", "#2C3E50", "#1a1a2e"] },
  Thunderstorm: { day: ["#16213e", "#533483", "#16213e"], night: ["#0d0d0d", "#1a0533", "#0d0d0d"] },
  Snow: { day: ["#e0e0e0", "#a8c0cc", "#e8e8e8"], night: ["#1a2a4a", "#2a3a6a", "#1a2a4a"] },
  Mist: { day: ["#606c88", "#3f4c6b", "#8a9db5"], night: ["#2c3e50", "#3d5068", "#2c3e50"] },
  Fog: { day: ["#606c88", "#3f4c6b", "#8a9db5"], night: ["#2c3e50", "#3d5068", "#2c3e50"] },
  Haze: { day: ["#C9D6FF", "#E2E2E2", "#C9D6FF"], night: ["#2c3e50", "#34495e", "#2c3e50"] },
};

if (typeof window !== 'undefined') {
  posthog.init('phc_qDpWqykcdpSVSAcffGDvwUrDGZA6FiVqG5HujnSWGpRW', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
  });
}

const getBackground = (condition, isDay) => {
  const theme = WEATHER_BACKGROUNDS[condition] || WEATHER_BACKGROUNDS["Clouds"];
  const colors = isDay ? theme.day : theme.night;
  return `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`;
};

const WeatherIcon = ({ condition, size = 80 }) => {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️",
    Haze: "🌤️",
  };
  return (
    <span style={{ fontSize: size, lineHeight: 1, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>
      {icons[condition] || "🌡️"}
    </span>
  );
};

const WindDirection = ({ deg }) => {
  return (
    <span
      style={{
        display: "inline-block",
        transform: `rotate(${deg}deg)`,
        fontSize: 16,
        transition: "transform 0.5s ease",
      }}
    >
      ↑
    </span>
  );
};

const StatCard = ({ label, value, icon, unit }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(12px)",
      borderRadius: 16,
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
      border: "1px solid rgba(255,255,255,0.18)",
      transition: "background 0.2s",
    }}
    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
  >
    <span style={{ fontSize: 18 }}>{icon}</span>
    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: "'Space Mono', monospace", letterSpacing: 1, textTransform: "uppercase" }}>
      {label}
    </span>
    <span style={{ color: "#fff", fontSize: 16, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
      {value} {unit}
    </span>
  </div>
);

const ForecastCard = ({ day, icon, min, max }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(8px)",
      borderRadius: 14,
      padding: "12px 10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      border: "1px solid rgba(255,255,255,0.15)",
      flex: 1,
      minWidth: 0,
    }}
  >
    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: "'Space Mono', monospace", letterSpacing: 0.5 }}>
      {day}
    </span>
    <span style={{ fontSize: 24 }}>{icon}</span>
    <div style={{ display: "flex", gap: 6, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
      <span style={{ color: "#fff", fontWeight: 700 }}>{max}°</span>
      <span style={{ color: "rgba(255,255,255,0.45)" }}>{min}°</span>
    </div>
  </div>
);

export default function App() {
  const [city, setCity] = useState("Kyiv");
  const [inputValue, setInputValue] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("metric");
  const [animate, setAnimate] = useState(false);
  const [showTopForecastBtn, setShowTopForecastBtn] = useState(false);

  useEffect(() => {
    posthog.onFeatureFlags(() => {
      if (posthog.isFeatureEnabled('show-forecast-button-top')) {
        setShowTopForecastBtn(true);
      } else {
        setShowTopForecastBtn(false);
      }
    });
  }, []);

  const fetchWeather = useCallback(async (cityName) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setError("");
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${unit}&lang=ua`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=${unit}&lang=ua`),
      ]);
      if (!weatherRes.ok) throw new Error("Місто не знайдено");
      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      setWeather(weatherData);

      // Group forecast by day
      const days = {};
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toLocaleDateString("uk-UA", { weekday: "short" });
        if (!days[dayKey]) days[dayKey] = { temps: [], icons: [] };
        days[dayKey].temps.push(item.main.temp);
        days[dayKey].icons.push(item.weather[0].main);
      });

      const forecastArr = Object.entries(days).slice(1, 6).map(([day, data]) => ({
        day,
        min: Math.round(Math.min(...data.temps)),
        max: Math.round(Math.max(...data.temps)),
        icon: getMostFrequent(data.icons),
      }));

      setForecast(forecastArr);
      posthog.capture('weather_searched', {
        city: weatherData.name,
        country: weatherData.sys.country,
        temperature: Math.round(weatherData.main.temp),
        weather_condition: weatherData.weather[0].main,
        unit: unit,
      });
      if (forecastArr.length > 0) {
        posthog.capture('forecast_viewed', {
          city: weatherData.name,
          days_count: forecastArr.length,
        });
      }
      setAnimate(true);
      setTimeout(() => setAnimate(false), 600);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  const getMostFrequent = (arr) => {
    return arr.sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length).pop();
  };

  const getForecastIcon = (condition) => {
    const icons = { Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Drizzle: "🌦️", Thunderstorm: "⛈️", Snow: "❄️", Mist: "🌫️" };
    return icons[condition] || "🌡️";
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchWeather(city); }, [city, unit]);

  const condition = weather?.weather[0]?.main || "Clouds";
  const isDay = weather ? (weather.dt > weather.sys.sunrise && weather.dt < weather.sys.sunset) : true;
  const bg = getBackground(condition, isDay);

  const tempUnit = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "м/с" : "mph";

  const formatTime = (ts) => new Date(ts * 1000).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });

  const throwTestError = () => {
    Sentry.addBreadcrumb({
      message: 'Test error button clicked',
      category: 'user',
      level: 'info',
    });
    throw new Error('Sentry Test Error: Weather Widget broke!');
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'DM Sans', sans-serif",
        transition: "background 1.5s ease",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          opacity: animate ? 0 : 1,
          transform: animate ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {/* Search bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && inputValue.trim() && (setCity(inputValue.trim()), setInputValue(""))}
            placeholder="Введіть місто..."
            style={{
              flex: 1,
              padding: "12px 18px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              color: "#fff",
              fontSize: 15,
              outline: "none",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <button
            onClick={() => inputValue.trim() && (setCity(inputValue.trim()), setInputValue(""))}
            style={{
              padding: "12px 18px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(12px)",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            🔍
          </button>
          <button
            onClick={() => {
              const newUnit = unit === "metric" ? "imperial" : "metric";
              setUnit(newUnit);
              posthog.capture('units_switched', {
                from: unit,
                to: newUnit,
                city: weather?.name,
              });
            }}
            style={{
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              color: "#fff",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
            }}
          >
            {unit === "metric" ? "°F" : "°C"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(255,80,80,0.25)", border: "1px solid rgba(255,80,80,0.4)", borderRadius: 12, padding: "12px 16px", color: "#fff", marginBottom: 12, fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        {/* НОВА КНОПКА ФІЧА-ФЛАГА */}
        {showTopForecastBtn && (
          <button 
            onClick={() => {
                // Якщо у тебе немає функції setShowForecast, можна просто скролити вниз до прогнозу
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "16px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.3)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.4)",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: "bold"
            }}
          >
            Прогноз на 5 днів ↓
          </button>
        )}
        
        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.7)", fontSize: 14, letterSpacing: 2, fontFamily: "'Space Mono', monospace" }}>
            ЗАВАНТАЖЕННЯ...
          </div>
        )}

        {/* Main card */}
        {weather && !loading && (
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(20px)",
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.2)",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
            }}
          >
            {/* Top section */}
            <div style={{ padding: "28px 28px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Space Mono', monospace" }}>
                    {weather.sys.country}
                  </div>
                  <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 700, margin: "4px 0 0", lineHeight: 1.1 }}>
                    {weather.name}
                  </h1>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 4, textTransform: "capitalize" }}>
                    {weather.weather[0].description}
                  </div>
                </div>
                <WeatherIcon condition={condition} size={72} />
              </div>

              {/* Temperature */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginTop: 20 }}>
                <span style={{ color: "#fff", fontSize: 80, fontWeight: 300, lineHeight: 1, letterSpacing: -4 }}>
                  {Math.round(weather.main.temp)}
                </span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 28, marginBottom: 10 }}>{tempUnit}</span>
                <div style={{ marginBottom: 10, marginLeft: 8, color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6, fontFamily: "'Space Mono', monospace" }}>
                  <div>↑ {Math.round(weather.main.temp_max)}{tempUnit}</div>
                  <div>↓ {Math.round(weather.main.temp_min)}{tempUnit}</div>
                </div>
              </div>

              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "'Space Mono', monospace" }}>
                Відчувається як {Math.round(weather.main.feels_like)}{tempUnit}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "0 20px" }} />

            {/* Stats grid */}
            <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <StatCard label="Вологість" value={weather.main.humidity} icon="💧" unit="%" />
              <StatCard
                label="Вітер"
                value={<span><WindDirection deg={weather.wind.deg} /> {Math.round(weather.wind.speed)}</span>}
                icon="🌬️"
                unit={windUnit}
              />
              <StatCard label="Тиск" value={weather.main.pressure} icon="🌡️" unit="гПа" />
              <StatCard label="Видимість" value={(weather.visibility / 1000).toFixed(1)} icon="👁️" unit="км" />
              <StatCard label="Схід сонця" value={formatTime(weather.sys.sunrise)} icon="🌅" unit="" />
              <StatCard label="Захід сонця" value={formatTime(weather.sys.sunset)} icon="🌇" unit="" />
            </div>

            {/* Forecast */}
            {forecast.length > 0 && (
              <>
                <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "0 20px" }} />
                <div style={{ padding: "16px 20px 20px" }}>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Space Mono', monospace", marginBottom: 10 }}>
                    5-ДЕННИЙ ПРОГНОЗ
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {forecast.map((f, i) => (
                      <ForecastCard
                        key={i}
                        day={f.day}
                        icon={getForecastIcon(f.icon)}
                        min={f.min}
                        max={f.max}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Footer */}
            <div style={{ padding: "8px 20px 16px", color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}>
              ОНОВЛЕНО {new Date(weather.dt * 1000).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })} • OPENWEATHERMAP
              <div style={{
                padding: "6px 20px 10px",
                color: "rgba(255,255,255,0.25)",
                fontSize: 10,
                fontFamily: "'Space Mono', monospace",
                letterSpacing: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span>WEATHER WIDGET v{import.meta.env.VITE_APP_VERSION}</span>
                <span style={{
                  background: import.meta.env.VITE_APP_STATUS === 'Production'
                    ? "rgba(255,100,100,0.2)"
                    : "rgba(100,255,150,0.2)",
                  border: `1px solid ${import.meta.env.VITE_APP_STATUS === 'Production'
                    ? "rgba(255,100,100,0.4)"
                    : "rgba(100,255,150,0.4)"}`,
                  borderRadius: 6,
                  padding: "2px 8px",
                  color: import.meta.env.VITE_APP_STATUS === 'Production'
                    ? "rgba(255,150,150,0.8)"
                    : "rgba(150,255,180,0.8)",
                }}>
                  {import.meta.env.VITE_APP_STATUS || 'Development'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={throwTestError}
        style={{
          position: 'fixed', bottom: 20, right: 20,
          padding: '8px 16px', background: 'rgba(255,0,0,0.7)',
          color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer'
        }}
      >
        💥 Break the world
      </button>      
    </div>
  );
}