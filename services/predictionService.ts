
import { Hotspot, WeatherData, LocalEvent } from '../types';

/**
 * Structure for ML Training (Synthetic Dataset):
 * {timestamp, location(lat,lng), demand_score, platform, weather, day_of_week}
 */
export interface TrainingDataPoint {
  timestamp: string;
  lat: number;
  lng: number;
  demand_score: number;
  platform: string;
  weather: string;
  day_of_week: number;
}

export class DemandPredictionEngine {
  /**
   * Generates a synthetic dataset for initial model "warm-up".
   * This mimics the historical data required for an LSTM/ARIMA model.
   */
  static generateSyntheticTrainingData(count: number = 1000): TrainingDataPoint[] {
    const platforms = ['Swiggy', 'Zomato', 'Uber', 'Rapido', 'Zepto'];
    const weatherTypes = ['Sunny', 'Rainy', 'Cloudy'];
    const data: TrainingDataPoint[] = [];

    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setHours(date.getHours() - Math.floor(Math.random() * 720)); // Last 30 days
      
      data.push({
        timestamp: date.toISOString(),
        lat: 12.9 + Math.random() * 0.1, // Bangalore Central
        lng: 77.5 + Math.random() * 0.1,
        demand_score: Math.floor(Math.random() * 10) + 1,
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        weather: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
        day_of_week: date.getDay()
      });
    }
    return data;
  }

  /**
   * Simulated Inference Engine.
   * In a production Flutter/Native app, this would use tflite_flutter.
   */
  static async predictNextHour(city: string, weather: WeatherData, event?: LocalEvent): Promise<Hotspot[]> {
    // Artificial latency for "Model Inference" processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Dynamic base zones
    const baseHotspots: Hotspot[] = [
      { area: 'Koramangala 5th Block', coordinates: { x: 35, y: 45 }, intensity: 7.8, demandReason: 'Food Cluster', distance: '1.1 km', expectedIncentive: '₹35' },
      { area: 'Indiranagar 100ft Rd', coordinates: { x: 65, y: 30 }, intensity: 8.5, demandReason: 'Night Peak', distance: '3.2 km', expectedIncentive: '₹55' },
      { area: 'Electronic City Ph 1', coordinates: { x: 50, y: 75 }, intensity: 6.9, demandReason: 'Office Exit', distance: '7.8 km', expectedIncentive: '₹30' },
      { area: 'MG Road Metro', coordinates: { x: 45, y: 20 }, intensity: 6.2, demandReason: 'Transit Peak', distance: '4.1 km', expectedIncentive: '₹25' },
      { area: 'HSR Sector 2', coordinates: { x: 25, y: 70 }, intensity: 8.1, demandReason: 'Grocery Surge', distance: '2.5 km', expectedIncentive: '₹45' },
      { area: 'Whitefield ITPL', coordinates: { x: 80, y: 55 }, intensity: 7.2, demandReason: 'Tech Park Exit', distance: '11 km', expectedIncentive: '₹60' }
    ];

    // Model Weighting Logic
    const weatherMult = weather.condition === 'Rainy' ? 1.7 : 1.0;
    const eventBoost = event && event.expectedDemand === 'Extreme' ? 1.5 : 1.1;
    const hour = new Date().getHours();
    const dinnerSurge = (hour >= 19 && hour <= 22) ? 1.3 : 1.0;

    return baseHotspots.map(spot => {
      let finalIntensity = spot.intensity * weatherMult * eventBoost * dinnerSurge;
      // Add volatility factor (simulated market noise)
      finalIntensity += (Math.random() - 0.5) * 2;

      return {
        ...spot,
        intensity: Math.min(10, Math.max(1, finalIntensity))
      };
    }).sort((a, b) => b.intensity - a.intensity);
  }
}

export const getMockWeather = (): WeatherData => ({
  temp: 27,
  condition: Math.random() > 0.7 ? 'Rainy' : 'Sunny',
  impact: 1.4
});

export const getMockEvent = (): LocalEvent => ({
  name: 'IPL: RCB vs MI',
  location: 'Chinnaswamy Stadium',
  startTime: '19:30',
  expectedDemand: 'Extreme'
});
