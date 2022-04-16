export interface ILog {
  temperature_min: number;
  temperature_max: number;
  temperature_avg: number;

  humidity_min: number;
  humidity_max: number;
  humidity_avg: number;

  precipitation_min: number;
  precipitation_max: number;
  precipitation_avg: number;

  solar_incidence_min: number;
  solar_incidence_max: number;
  solar_incidence_avg: number;

  wind_direction_avg: number;
  pressure_avg: number;
  wind_speed_avg: number;

  reference_date: string;
  station_id: string;
  created_at: string;
}
