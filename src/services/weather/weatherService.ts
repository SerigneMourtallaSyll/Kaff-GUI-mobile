/**
 * Weather service using wttr.in API (no API key required)
 * Alternative: OpenWeatherMap (requires API key)
 */

export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  location: string;
}

export interface WeatherCondition {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'clear' | 'partly-cloudy';
  description: string;
  humidity: number;
  windSpeed: number;
}

/**
 * Get weather for Dakar, Senegal using wttr.in
 */
export async function getWeather(): Promise<WeatherData> {
  try {
    // Using wttr.in API - no key required
    // Format: ?format=j1 for JSON
    const response = await fetch('https://wttr.in/Dakar?format=j1');

    if (!response.ok) {
      throw new Error('Failed to fetch weather');
    }

    const data = await response.json();
    const current = data.current_condition[0];

    // Map weather code to condition
    const weatherCode = parseInt(current.weatherCode);
    const condition = mapWeatherCode(weatherCode);

    return {
      temperature: parseInt(current.temp_C),
      condition: condition,
      description: current.weatherDesc[0].value,
      humidity: parseInt(current.humidity),
      windSpeed: parseInt(current.windspeedKmph),
      icon: getWeatherIcon(condition),
      location: 'Dakar',
    };
  } catch (error) {
    console.error('[Weather] Error fetching weather:', error);
    // Return default data on error
    return {
      temperature: 28,
      condition: 'sunny',
      description: 'Ensoleillé',
      humidity: 60,
      windSpeed: 15,
      icon: '☀️',
      location: 'Dakar',
    };
  }
}

/**
 * Map wttr.in weather code to our condition type
 */
function mapWeatherCode(code: number): WeatherData['condition'] {
  // Clear/Sunny
  if (code === 113) return 'sunny';

  // Partly cloudy
  if (code === 116) return 'partly-cloudy';

  // Cloudy/Overcast
  if ([119, 122].includes(code)) return 'cloudy';

  // Rain
  if (
    [
      176, 263, 266, 281, 284, 293, 296, 299, 302, 305, 308, 311, 314, 317, 353, 356, 359, 362, 365,
    ].includes(code)
  ) {
    return 'rainy';
  }

  // Thunderstorm
  if ([386, 389, 392, 395].includes(code)) return 'stormy';

  // Default to clear
  return 'clear';
}

/**
 * Get emoji icon for weather condition
 */
function getWeatherIcon(condition: string): string {
  switch (condition) {
    case 'sunny':
      return '☀️';
    case 'clear':
      return '🌙';
    case 'partly-cloudy':
      return '⛅';
    case 'cloudy':
      return '☁️';
    case 'rainy':
      return '🌧️';
    case 'stormy':
      return '⛈️';
    default:
      return '☀️';
  }
}

/**
 * Get background gradient colors based on weather and temperature
 */
export function getWeatherGradient(temp: number, condition: string): [string, string] {
  // Hot (>30°C)
  if (temp > 30) {
    return ['#FF6B6B', '#FF8E53']; // Red to orange
  }

  // Warm (25-30°C)
  if (temp > 25) {
    if (condition === 'rainy' || condition === 'stormy') {
      return ['#4A5568', '#718096']; // Gray for rainy
    }
    return ['#F59E0B', '#FBBF24']; // Orange to yellow
  }

  // Pleasant (20-25°C)
  if (temp > 20) {
    if (condition === 'rainy' || condition === 'stormy') {
      return ['#4A5568', '#718096']; // Gray for rainy
    }
    return ['#10B981', '#34D399']; // Green
  }

  // Cool (<20°C)
  if (condition === 'rainy' || condition === 'stormy') {
    return ['#4A5568', '#718096']; // Gray for rainy
  }
  return ['#3B82F6', '#60A5FA']; // Blue
}

/**
 * Get text color for weather card (white or dark based on background)
 */
export function getWeatherTextColor(_temp: number): string {
  return '#FFFFFF'; // Always white for better contrast on gradients
}
