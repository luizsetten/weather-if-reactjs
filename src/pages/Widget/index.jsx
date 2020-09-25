import React, { useEffect, useState } from 'react';
import api from '../../services/axios';

import './styles.css';

const Widget = ({ props }) => {
  const {
    nameStation,
    setNameStation,
    selectedStation,
    setSelectedStation,
    logs,
    setLogs,
  } = props;
  // const [stationName, setStationName] = useState('');
  const [temperature, setTemperature] = useState('');
  const [pressure, setPressure] = useState('');
  const [humidity, setHumidity] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [gustOfWind, setGustOfWind] = useState('');
  const [windDirection, setWindDirection] = useState('');
  const [precipitation, setPrecipitation] = useState('');
  const [solarIncidence, setSolarIncidence] = useState('');

  async function loadLocalStorage() {
    if (selectedStation === '') {
      const savedSelec = await localStorage.getItem('@weatherData/selectedStation');
      setSelectedStation(savedSelec);
    }
  }

  async function loadLogs() {
    const response = await api.get(`/stations/${selectedStation}/logs`);
    setLogs(response.data);
  }

  function setData() {
    const lastLog = logs[logs.length - 1];
    if (lastLog !== undefined) {
      setTemperature(lastLog.temperature);
      setPressure(lastLog.pressure);
      setHumidity(lastLog.humidity);
      setWindSpeed(lastLog.windspeed);
      setGustOfWind(lastLog.gustofwind);
      setWindDirection(lastLog.winddirection);
      setPrecipitation(lastLog.precipitation);
      setSolarIncidence(lastLog.solarincidence);
    }
  }

  async function loadAll() {
    try {
      loadLocalStorage();
      loadLogs();
      setData();
    } catch (e) {
      console.log(e);
    }
  }

  async function loadNameStation() {
    if (nameStation === '') {
      const savedName = await localStorage.getItem('@weatherData/nameStation');
      setNameStation(savedName);
    }
  }

  useEffect(() => {
    loadNameStation();
    loadAll();
  });

  return (
    <div>
      <i className="arrow left" id="back" />
      <h2 id="stationTitle">
        Estação Meteorológica -
        {' '}
        {nameStation}
      </h2>
      <div id="widget">
        <div id="basic">
          <div className="box" />
          <div className="box" id="temperature">{temperature}</div>
        </div>
        <div className="lineWidget">
          <span>Pressão atmosférica</span>
          {' '}
          <strong id="pressure">{pressure}</strong>
        </div>
        <div className="lineWidget">
          <span>Umidade relativa</span>
          {' '}
          <strong id="humidity">{humidity}</strong>
        </div>
        <div className="lineWidget">
          <span>Velocidade do vento</span>
          {' '}
          <strong id="windSpeed">{windSpeed}</strong>
        </div>
        <div className="lineWidget">
          <span>Rajada do vento</span>
          {' '}
          <strong id="gustOfWind">{gustOfWind}</strong>
        </div>
        <div className="lineWidget">
          <span>Direção do vento</span>
          {' '}
          <strong id="windDirection">{windDirection}</strong>
        </div>
        <div className="lineWidget">
          <span>Precipitação</span>
          {' '}
          <strong id="precipitation">{precipitation}</strong>
        </div>
        <div className="lineWidget">
          <span>Irradiação solar</span>
          {' '}
          <strong id="solarIncidence">{solarIncidence}</strong>
        </div>
        <button type="button" id="moreInfo">Mais Informações</button>
      </div>
    </div>
  );
};
export default Widget;
