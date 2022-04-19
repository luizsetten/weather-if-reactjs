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

  return logs;
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
