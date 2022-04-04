import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

import Item from "./item";
import { ILog } from "../../types/ILog";
import Sun from "../../resources/images/sun.png";
import LowRain from "../../resources/images/low-rain.png";
import MedRain from "../../resources/images/med-rain.png";
import HighRain from "../../resources/images/high-rain.png";

import api from "../../services/axios";

import "./styles.css";

interface IWidgetProps {
  props: {
    nameStation: string;
    setNameStation: (a: string) => void;
    selectedStation: string;
    setSelectedStation: (a: string) => void;
    logs: ILog[];
    setLogs: (a: ILog[]) => void;
  };
}

function Widget({ props }: IWidgetProps) {
  const {
    nameStation,
    setNameStation,
    selectedStation,
    setSelectedStation,
    logs,
    setLogs,
  } = props;

  const history = useNavigate();

  const [temperature, setTemperature] = useState(0);
  const [minTemperature, setMinTemperature] = useState(0);
  const [maxTemperature, setMaxTemperature] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [gustOfWind, setGustOfWind] = useState(0);
  const [windDirection, setWindDirection] = useState(0);
  const [precipitation, setPrecipitation] = useState(0);
  const [solarIncidence, setSolarIncidence] = useState(0);
  const [weatherImg, setWeatherImg] = useState(Sun);

  function handleBack() {
    history(-1);
  }

  function handleMoreInfo() {
    history("/logs");
  }

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

  function selecImg(precipitation2: number) {
    if (Number(precipitation2) > 50) {
      return HighRain;
    }
    if (Number(precipitation2) > 25) {
      return MedRain;
    }
    if (Number(precipitation2) > 0) {
      return LowRain;
    }
    return Sun;
  }

  function setData() {
    const lastLog = logs[logs.length - 1];
    console.log("------------->", lastLog);
    if (lastLog !== undefined) {
      setTemperature(lastLog.temperature);
      setMinTemperature(lastLog.temperature);
      setMaxTemperature(lastLog.temperature);
      setPressure(lastLog.pressure);
      setHumidity(lastLog.humidity);
      setWindSpeed(lastLog.windspeed);
      setGustOfWind(lastLog.gustofwind);
      setWindDirection(lastLog.winddirection);
      setPrecipitation(lastLog.precipitation);
      setSolarIncidence(lastLog.solarincidence);
      setWeatherImg(selecImg(lastLog.precipitation));
    }
  }

  useEffect(() => {
    loadLocalStorage();
    setInterval(loadLogs, 60000);
  }, []);

  useEffect(() => {
    loadLogs();
  }, [selectedStation]);

  useEffect(() => {
    setData();
  }, [logs]);

  return (
    <div className="container">
      <ToastContainer />
      <FaArrowLeft size={32} className="arrow" onClick={handleBack} />
      <h2 id="stationTitle">Estação Meteorológica - {nameStation}</h2>
      <div id="widget">
        <div id="basic">
          <div className="box">
            <img id="image" src={weatherImg} alt={weatherImg} />
          </div>

          <div className="box" id="temperature">
            <h1>{`${temperature}°C`}</h1>
            <div id="min-max">
              <h3 id="max">{`${maxTemperature}°C`}</h3>
              <h3>/</h3>
              <h3 id="min">{`${minTemperature}°C`}</h3>
            </div>
          </div>
        </div>
        <Item
          description="Pressão atmosférica"
          id="pressure"
          content={`${pressure}hPa`}
        />
        <Item
          description="Humidade relativa"
          id="humidity"
          content={`${humidity}%`}
        />
        <Item
          description="Velocidade do vento"
          id="windSpeed"
          content={`${windSpeed}Km/h`}
        />
        <Item
          description="Rajada do vento"
          id="gustOfWind"
          content={`${gustOfWind}Km/h`}
        />
        <Item
          description="Direção do vento"
          id="windDirection"
          content={windDirection}
        />
        <Item
          description="Precipitação"
          id="precipitation"
          content={`${precipitation}mm`}
        />
        <Item
          description="Irradiação Solar"
          id="solarIncidence"
          content={solarIncidence}
        />
        <button type="button" id="moreInfo" onClick={handleMoreInfo}>
          Mais Informações
        </button>
      </div>
    </div>
  );
}
export default Widget;
