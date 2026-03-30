import { describe, it, expect } from 'vitest'
import {
  getBackground,
  formatTemperature,
  convertTemperature,
  formatWindSpeed,
  formatVisibility,
  isValidCityName,
  getMostFrequentCondition,
  getWeatherEmoji,
} from '../utils.js'

// ─── ТЕСТ 1: getBackground ───────────────────────────────────────
describe('getBackground', () => {
  it('повертає градієнт для ясної погоди вдень', () => {
    const result = getBackground('Clear', true)
    expect(result).toContain('linear-gradient')
    expect(result).toContain('#FF6B35')
  })

  it('повертає градієнт для ясної погоди вночі', () => {
    const result = getBackground('Clear', false)
    expect(result).toContain('#0F0C29')
  })

  it('повертає градієнт для хмарної погоди за замовчуванням при невідомій умові', () => {
    const result = getBackground('UnknownCondition', true)
    expect(result).toContain('linear-gradient')
    expect(result).toContain('#757F9A')
  })

  it('повертає різні градієнти для дня і ночі', () => {
    const day = getBackground('Rain', true)
    const night = getBackground('Rain', false)
    expect(day).not.toBe(night)
  })
})

// ─── ТЕСТ 2: formatTemperature ───────────────────────────────────
describe('formatTemperature', () => {
  it('форматує температуру в Цельсіях', () => {
    expect(formatTemperature(20, 'metric')).toBe('20°C')
  })

  it('форматує температуру у Фаренгейтах', () => {
    expect(formatTemperature(68, 'imperial')).toBe('68°F')
  })

  it('округлює дробові значення', () => {
    expect(formatTemperature(20.7, 'metric')).toBe('21°C')
  })

  it('коректно обробляє від`ємні температури', () => {
    expect(formatTemperature(-5.3, 'metric')).toBe('-5°C')
  })
})

// ─── ТЕСТ 3: convertTemperature ──────────────────────────────────
describe('convertTemperature', () => {
  it('повертає Цельсій без змін при metric', () => {
    expect(convertTemperature(100, 'metric')).toBe(100)
  })

  it('конвертує 0°C у 32°F', () => {
    expect(convertTemperature(0, 'imperial')).toBe(32)
  })

  it('конвертує 100°C у 212°F', () => {
    expect(convertTemperature(100, 'imperial')).toBe(212)
  })

  it('конвертує -40°C у -40°F', () => {
    expect(convertTemperature(-40, 'imperial')).toBe(-40)
  })
})

// ─── ТЕСТ 4: formatWindSpeed ──────────────────────────────────────
describe('formatWindSpeed', () => {
  it('форматує швидкість вітру в м/с', () => {
    expect(formatWindSpeed(5, 'metric')).toBe('5 м/с')
  })

  it('форматує швидкість вітру в mph', () => {
    expect(formatWindSpeed(10, 'imperial')).toBe('10 mph')
  })

  it('округлює дробові значення швидкості', () => {
    expect(formatWindSpeed(7.8, 'metric')).toBe('8 м/с')
  })
})

// ─── ТЕСТ 5: formatVisibility ────────────────────────────────────
describe('formatVisibility', () => {
  it('показує метри якщо менше 1000', () => {
    expect(formatVisibility(500)).toBe('500 м')
  })

  it('конвертує у кілометри якщо більше 1000', () => {
    expect(formatVisibility(10000)).toBe('10.0 км')
  })

  it('правильно обробляє рівно 1000 метрів', () => {
    expect(formatVisibility(1000)).toBe('1.0 км')
  })
})

// ─── ТЕСТ 6: isValidCityName ──────────────────────────────────────
describe('isValidCityName', () => {
  it('повертає true для коректної назви міста', () => {
    expect(isValidCityName('Kyiv')).toBe(true)
  })

  it('повертає false для порожнього рядка', () => {
    expect(isValidCityName('')).toBe(false)
  })

  it('повертає false для null', () => {
    expect(isValidCityName(null)).toBe(false)
  })

  it('повертає false для однієї літери', () => {
    expect(isValidCityName('K')).toBe(false)
  })

  it('повертає true для міста з пробілом', () => {
    expect(isValidCityName('New York')).toBe(true)
  })

  it('повертає false для рядка з лише пробілів', () => {
    expect(isValidCityName('   ')).toBe(false)
  })
})

// ─── ТЕСТ 7: getMostFrequentCondition ────────────────────────────
describe('getMostFrequentCondition', () => {
  it('повертає найчастішу умову погоди', () => {
    const result = getMostFrequentCondition(['Clear', 'Rain', 'Clear', 'Clear'])
    expect(result).toBe('Clear')
  })

  it('повертає Clouds за замовчуванням для порожнього масиву', () => {
    expect(getMostFrequentCondition([])).toBe('Clouds')
  })

  it('повертає Clouds для null', () => {
    expect(getMostFrequentCondition(null)).toBe('Clouds')
  })

  it('повертає єдину умову якщо вона одна', () => {
    expect(getMostFrequentCondition(['Snow'])).toBe('Snow')
  })
})

// ─── ТЕСТ 8: getWeatherEmoji ──────────────────────────────────────
describe('getWeatherEmoji', () => {
  it('повертає сонце для Clear', () => {
    expect(getWeatherEmoji('Clear')).toBe('☀️')
  })

  it('повертає хмару для Clouds', () => {
    expect(getWeatherEmoji('Clouds')).toBe('☁️')
  })

  it('повертає сніжинку для Snow', () => {
    expect(getWeatherEmoji('Snow')).toBe('❄️')
  })

  it('повертає термометр для невідомої умови', () => {
    expect(getWeatherEmoji('Unknown')).toBe('🌡️')
  })
})

expect(true).toBe(true);