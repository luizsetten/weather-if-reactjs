import api from "../config/axios";
import { ILog } from "../types/ILog";

const loadLogs = async (
  stationId: string,
  startDate: string,
  endDate: string
): Promise<ILog[]> => {
  const {
    data: { logs },
  } = await api.get(`/logs/${stationId}/${startDate}/${endDate}`);

  return logs.map((log: ILog) => {
    return {
      ...log,
      humidity_avg: Number(log.humidity_avg.toFixed(2)),
      humidity_min: Number(log.humidity_min.toFixed(2)),
      humidity_max: Number(log.humidity_max.toFixed(2)),
      pressure_avg: Number(log.pressure_avg.toFixed(2)),
      pressure_min: Number(log.pressure_min.toFixed(2)),
      pressure_max: Number(log.pressure_max.toFixed(2)),
      precipitation_acc: Number(log.precipitation_acc.toFixed(2)),
      wind_speed_avg: Number(log.wind_speed_avg.toFixed(2)),
      wind_speed_min: Number(log.wind_speed_min.toFixed(2)),
      wind_speed_max: Number(log.wind_speed_max.toFixed(2)),
      solar_incidence_avg: Number(log.solar_incidence_avg.toFixed(2)),
      solar_incidence_min: Number(log.solar_incidence_min.toFixed(2)),
      solar_incidence_max: Number(log.solar_incidence_max.toFixed(2)),
      temperature_avg: Number(log.temperature_avg.toFixed(2)),
      temperature_min: Number(log.temperature_min.toFixed(2)),
      temperature_max: Number(log.temperature_max.toFixed(2)),
    } as ILog;
  });
};

const downloadLogs = async (
  stationId: string,
  startDate: string,
  endDate: string
): Promise<Blob> => {
  const { data } = await api.get(
    `/logs/${stationId}/${startDate}/${endDate}/download`,
    {
      headers: {
        "Content-Type": "text/csv",
      },
    }
  );

  return data;
};

// eslint-disable-next-line import/prefer-default-export
export { loadLogs, downloadLogs };
