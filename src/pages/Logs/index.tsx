/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import CsvDownload from "react-json-to-csv";
import DatePicker from "react-datepicker";
import Graph from "./graph";
import api from "../../services/axios";

import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";
import { ILog } from "../../types/ILog";
import MultiGraph from "./multiGraph";

interface ILogsProps {
  props: {
    nameStation: string;
    setNameStation: (a: string) => void;
    selectedStation: string;
    setSelectedStation: (a: string) => void;
    logs: ILog[];
    setLogs: (a: ILog[]) => void;
    startDate: Date;
    setStartDate: (a: Date) => void;
    endDate: Date;
    setEndDate: (a: Date) => void;
  };
}

function Logs({ props }: ILogsProps) {
  const {
    nameStation,
    setNameStation,
    selectedStation,
    setSelectedStation,
    logs,
    setLogs,
  } = props;
  const [data, setData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState(new Date("2019"));
  const [endDate, setEndDate] = useState(new Date());
  const navigate = useNavigate();
  const [filteredLogs, setFilteredLogs] = useState<ILog[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  async function loadLocalStorage() {
    if (selectedStation === "") {
      const savedSelec = await localStorage.getItem(
        "@weatherData/selectedStation"
      );
      if (savedSelec) await setSelectedStation(savedSelec);
    }

    if (nameStation === "") {
      const savedName = await localStorage.getItem("@weatherData/nameStation");
      if (savedName) await setNameStation(savedName);
    }
  }

  async function loadLogs() {
    try {
      if (selectedStation !== "") {
        const response = await api.get(`/stations/${selectedStation}/logs`);
        setLogs(response.data);
      }
    } catch (e) {
      toast.error("Erro ao obter os dados da estação");
    }
  }

  function handleBack() {
    navigate(-1);
  }

  useEffect(() => {
    loadLocalStorage();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [selectedStation]);

  useEffect(() => {
    const temp: ILog[] = [];
    logs.map((log) => {
      const logDate = new Date(log.created_at);
      if (startDate < logDate && logDate < endDate) {
        temp.push(log);
      }
    });
    setFilteredLogs(temp);
  }, [startDate, endDate, isFiltering]);

  useEffect(() => {
    if (isFiltering) {
      setData(filteredLogs);
    } else {
      setData(logs);
    }
  }, [logs, filteredLogs, isFiltering]);

  return (
    <div className="container">
      <FaArrowLeft size={32} className="arrow" onClick={handleBack} />
      <h2 id="stationTitle">Estação Meteorológica - {nameStation}</h2>
      <ToastContainer />
      <div id="filter">
        <div className="filterItem">
          <span>Data inicial</span>
          <DatePicker
            value={startDate.toString()}
            selected={new Date("2020")}
            onChange={(date: Date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={60}
            timeCaption="time"
            dateFormat="d/M/yyyy h:mm"
          />
        </div>

        <div className="filterItem">
          <span>Data final</span>
          <DatePicker
            value={endDate.toString()}
            selected={new Date()}
            onChange={(date: Date) => setEndDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={60}
            timeCaption="time"
            dateFormat="d/M/yyyy h:mm"
          />
        </div>

        <div className="filterItem">
          <span>Filtrar</span>
          <label className="switch" htmlFor="checkbox">
            <input
              type="checkbox"
              id="checkbox"
              onChange={(e) => setIsFiltering(e.target.checked)}
            />
            <span className="slider round" />
          </label>
        </div>
      </div>
      <div id="graphGroup">
        <MultiGraph
          data={[
            {
              max: 12,
              min: 10,
              avg: 11,
              createdAt: "22/05/2022 - 11:00",
            },
            {
              max: 12,
              min: 10,
              avg: 11,
              createdAt: "22/05/2022 - 12:00",
            },
            {
              max: 12,
              min: 10,
              avg: 11,
              createdAt: "22/05/2022 - 13:00",
            },
            {
              max: 25,
              min: 12,
              avg: 15,
              createdAt: "22/05/2022 - 14:00",
            },
            {
              max: 22,
              min: 20,
              avg: 21,
              createdAt: "22/05/2022 - 15:00",
            },
          ]}
          title="Temperatura"
          unit="°C"
        />
        <Graph
          data={data}
          dataKey="temperature"
          title="Temperatura"
          unit="°C"
          color="#ff0000"
        />
        <Graph
          data={data}
          dataKey="humidity"
          title="Humidade relativa"
          unit="%"
          color="#0000ff"
        />
        <Graph
          data={data}
          dataKey="pressure"
          title="Pressão Atmosférica"
          unit="hPa"
          color="#00ff00"
        />
        <Graph
          data={data}
          dataKey="windspeed"
          title="Velocidade do vento"
          unit="Km/h"
          color="#999999"
        />
        <Graph
          data={data}
          dataKey="gustofwind"
          title="Rajada do vento"
          unit="Km/h"
          color="#666666"
        />
        <Graph
          data={data}
          dataKey="winddirection"
          title="Direção do vento"
          unit="°"
          color="#3399ff"
        />
        <Graph
          data={data}
          dataKey="precipitation"
          title="Precipitação"
          unit="mm"
          color="#bb00ff"
        />
        <Graph
          data={data}
          dataKey="solarincidence"
          title="Irradiação solar"
          unit="%"
          color="#af5500"
        />
      </div>
      <CsvDownload data={data} filename="station_logs.csv">
        Exportar .csv
      </CsvDownload>
    </div>
  );
}

export default Logs;
