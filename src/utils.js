// Повертає фоновий градієнт залежно від погоди та часу доби
export const WEATHER_BACKGROUNDS = {
  Clear: {
    day: ["#FF6B35", "#F7931E", "#FFD23F"],
    night: ["#0F0C29", "#302B63", "#24243e"]
  },
  Clouds: {
    day: ["#757F9A", "#D7DDE8", "#a8c0cc"],
    night: ["#1a1a2e", "#16213e", "#4a4a6a"]
  },
  Rain: {
    day: ["#373B44", "#4286f4", "#373B44"],
    night: ["#0f2027", "#203a43", "#2c5364"]
  },
  Snow: {
    day: ["#e0e0e0", "#a8c0cc", "#e8e8e8"],
    night: ["#1a2a4a", "#2a3a6a", "#1a2a4a"]
  },
  Thunderstorm: {
    day: ["#16213e", "#533483", "#16213e"],
    night: ["#0d0d0d", "#1a0533", "#0d0d0d"]
  },
}

export function getBackground(condition, isDay) {
  const theme = WEATHER_BACKGROUNDS[condition] || WEATHER_BACKGROUNDS["Clouds"]
  const colors = isDay ? theme.day : theme.night
  return `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`
}

export function formatTemperature(temp, unit) {
  const rounded = Math.round(temp)
  const symbol = unit === 'metric' ? '°C' : '°F'
  return `${rounded}${symbol}`
}

export function convertTemperature(celsius, unit) {
  if (unit === 'imperial') {
    return Math.round((celsius * 9) / 5 + 32)
  }
  return Math.round(celsius)
}

export function formatWindSpeed(speed, unit) {
  const unitLabel = unit === 'metric' ? 'м/с' : 'mph'
  return `${Math.round(speed)} ${unitLabel}`
}

export function formatVisibility(meters) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} км`
  }
  return `${meters} м`
}

export function isValidCityName(city) {
  if (!city || typeof city !== 'string') return false
  const trimmed = city.trim()
  if (trimmed.length < 2) return false
  if (trimmed.length > 100) return false
  return true
}

export function getMostFrequentCondition(conditions) {
  if (!conditions || conditions.length === 0) return 'Clouds'
  const freq = {}
  conditions.forEach(c => { freq[c] = (freq[c] || 0) + 1 })
  return Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b)
}

export function formatSunTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getWeatherEmoji(condition) {
  const icons = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌤️',
  }
  return icons[condition] || '🌡️'
}