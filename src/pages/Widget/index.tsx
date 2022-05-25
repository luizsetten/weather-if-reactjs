import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "primereact/button";

import Item from "./item";
import { IRecord } from "../../types/IRecord";
import Sun from "../../resources/images/sun.png";
import LowRain from "../../resources/images/low-rain.png";
import MedRain from "../../resources/images/med-rain.png";
import HighRain from "../../resources/images/high-rain.png";

import api from "../../config/axios";

import "./styles.css";

interface IWidgetProps {
  props: {
    nameStation: string;
    setNameStation: (a: string) => void;
    selectedStation: string;
    setSelectedStation: (a: string) => void;
    logs: IRecord[];
    setLogs: (a: IRecord[]) => void;
  };
}

function Widget({ props }: IWidgetProps) {
  const { nameStation, selectedStation } = props;

  const history = useNavigate();

  const [temperature, setTemperature] = useState(0);
  // const [minTemperature, setMinTemperature] = useState(0);
  // const [maxTemperature, setMaxTemperature] = useState(0);
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

  function setData(data: IRecord) {
    if (data !== undefined) {
      setTemperature(data.temperature || 0);
      setPressure(data.pressure || 0);
      setHumidity(data.humidity || 0);
      setWindSpeed(data.wind_speed || 0);
      setGustOfWind(data.gust_of_wind || 0);
      setWindDirection(data.wind_direction || 0);
      setPrecipitation(data.precipitation || 0);
      setSolarIncidence(data.solar_incidence || 0);
      setWeatherImg(selecImg(data.precipitation));
    }
  }

  async function loadLog() {
    try {
      if (selectedStation !== "") {
        const response = await api.get(`/records/last/${selectedStation}`);
        setData(response.data);
      }
    } catch (e) {
      toast.error("Erro ao obter os dados da estação");
    }
  }

  useEffect(() => {
    setInterval(loadLog, 60000);
  }, []);

  useEffect(() => {
    loadLog();
  }, [selectedStation]);

  return (
    <div className="container p-mb-5">
      <Button
        icon="pi pi-arrow-left"
        iconPos="right"
        className="p-button-raised p-button-rounded p-as-start p-ml-5"
        onClick={handleBack}
      />
      <h2 className="p-mb-4">Estação Meteorológica - {nameStation}</h2>
      <div id="widget">
        <div id="basic">
          <div className="box">
            <img id="image" src={weatherImg} alt={weatherImg} />
          </div>

          <div className="box" id="temperature" style={{ width: "10rem" }}>
            <h1>{`${temperature.toFixed(2)}°C`}</h1>
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
          content={`${windSpeed}m/s`}
        />
        <Item
          description="Rajada do vento"
          id="gustOfWind"
          content={`${gustOfWind}m/s`}
        />
        <Item
          description="Direção do vento"
          id="windDirection"
          content={`${windDirection}°`}
        />
        <Item
          description="Precipitação"
          id="precipitation"
          content={`${precipitation}mm/min`}
        />
        <Item
          description="Irradiação Solar"
          id="solarIncidence"
          content={`${solarIncidence}W/m²`}
        />
        <Button label="Mais Informações" onClick={handleMoreInfo} />
      </div>
    </div>
  );
}
export default Widget;
