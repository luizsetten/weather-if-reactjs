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

// eslint-disable-next-line import/prefer-default-export
export { loadLogs };
