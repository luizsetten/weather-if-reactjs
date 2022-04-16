/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import CsvDownload from "react-json-to-csv";
import DatePicker from "react-datepicker";
import { addMonths, differenceInMonths } from "date-fns";
import MultiGraph from "./multiGraph";
import Graph from "./graph";
import { loadLogs } from "../../services/api";
import { IRecord } from "../../types/IRecord";

import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";
import { ILog } from "../../types/ILog";

interface IRecordsProps {
  props: {
    nameStation: string;
    setNameStation: (a: string) => void;
    selectedStation: string;
    setSelectedStation: (a: string) => void;
    logs: IRecord[];
    setLogs: (a: IRecord[]) => void;
    startDate: Date;
    setStartDate: (a: Date) => void;
    endDate: Date;
    setEndDate: (a: Date) => void;
  };
}

function Logs({ props }: IRecordsProps) {
  const { nameStation, selectedStation } = props;
  const [data, setData] = useState<ILog[]>([]);
  const [startDate, setStartDate] = useState(addMonths(new Date(), -2));
  const [endDate, setEndDate] = useState(new Date());
  const [showGraph, setShowGraph] = useState(true);
  const navigate = useNavigate();

  async function setLogs() {
    try {
      if (selectedStation !== "") {
        const logs = await loadLogs(
          selectedStation,
          startDate.toISOString(),
          endDate.toISOString()
        );
        setData(logs);
      }
    } catch (e) {
      toast.error("Erro ao obter os dados da estação");
    }
  }

  function handleBack() {
    navigate(-1);
  }

  /** TODO
   * Multigraphs
   * temperature_min
   * temperature_max
   * temperature_avg
   * humidity_min
   * humidity_max
   * humidity_avg
   * precipitation_min
   * precipitation_max
   * precipitation_avg
   * solar_incidence_min
   * solar_incidence_max
   * solar_incidence_avg
   *
   *
   * Graphs
   * wind_direction_avg
   * presure_avg
   * wind_speed_avg
   *
   */

  const mock = [
    {
      max: 12,
      min: 10,
      avg: 11,
      created_at: "22/05/2022 - 11:00",
    },
    {
      max: 12,
      min: 10,
      avg: 11,
      created_at: "22/05/2022 - 12:00",
    },
    {
      max: 12,
      min: 10,
      avg: 11,
      created_at: "22/05/2022 - 13:00",
    },
    {
      max: 25,
      min: 12,
      avg: 15,
      created_at: "22/05/2022 - 14:00",
    },
    {
      max: 22,
      min: 20,
      avg: 21,
      created_at: "22/05/2022 - 15:00",
    },
  ];

  useEffect(() => {
    setShowGraph(differenceInMonths(endDate, startDate) <= 2);
    setLogs();
  }, [selectedStation, startDate, endDate]);

  return (
    <div className="container">
      <FaArrowLeft size={32} className="arrow" onClick={handleBack} />
      <h2 id="stationTitle">Estação Meteorológica - {nameStation}</h2>
      <ToastContainer />
      <div id="filter">
        <div className="filterItem">
          <span>Data inicial</span>
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            showTimeSelect
            maxDate={endDate}
            timeFormat="HH:mm"
            timeIntervals={60}
            timeCaption="time"
            dateFormat="dd/MM/yyyy HH:mm"
          />
        </div>

        <div className="filterItem">
          <span>Data final</span>
          <DatePicker
            selected={endDate}
            minDate={startDate}
            maxDate={new Date()}
            onChange={(date: Date) => setEndDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={60}
            timeCaption="time"
            dateFormat="dd/MM/yyyy HH:mm"
          />
        </div>
      </div>
      <small>Acima de 2 meses só é possível exportar os dados</small>
      {showGraph && (
        <div id="graphGroup">
          <MultiGraph
            data={data.map((log) => ({
              reference_date: log.reference_date,
              avg: log.temperature_avg,
              max: log.temperature_max,
              min: log.temperature_min,
            }))}
            title="Temperatura"
            unit="°C"
          />

          <MultiGraph
            data={data.map((log) => ({
              reference_date: log.reference_date,
              avg: log.humidity_avg,
              max: log.humidity_max,
              min: log.humidity_min,
            }))}
            title="Humidade relativa"
            unit="%"
          />
          <Graph
            data={data.map((log) => ({
              reference_date: log.created_at,
              value: log.pressure_avg,
            }))}
            title="Pressão Atmosférica"
            unit="hPa"
            color="#00ff00"
          />
          <Graph
            data={data.map((log) => ({
              reference_date: log.created_at,
              value: log.wind_speed_avg,
            }))}
            title="Velocidade do vento"
            unit="Km/h"
            color="#999999"
          />
          <Graph
            data={data.map((log) => ({
              reference_date: log.created_at,
              value: log.wind_speed_avg * 2.7,
            }))}
            title="Rajada do vento"
            unit="Km/h"
            color="#666666"
          />
          <Graph
            data={data.map((log) => ({
              reference_date: log.created_at,
              value: log.wind_direction_avg,
            }))}
            title="Direção do vento"
            unit="°"
            color="#3399ff"
          />
          <MultiGraph
            data={data.map((log) => ({
              reference_date: log.reference_date,
              avg: log.precipitation_avg,
              max: log.precipitation_max,
              min: log.precipitation_min,
            }))}
            title="Precipitação"
            unit="mm"
          />
          <MultiGraph
            data={data.map((log) => ({
              reference_date: log.reference_date,
              avg: log.solar_incidence_avg,
              max: log.solar_incidence_max,
              min: log.solar_incidence_min,
            }))}
            title="Irradiação solar"
            unit="%"
          />
        </div>
      )}
      <CsvDownload data={data} filename="station_logs.csv">
        Exportar .csv
      </CsvDownload>
    </div>
  );
}

export default Logs;
