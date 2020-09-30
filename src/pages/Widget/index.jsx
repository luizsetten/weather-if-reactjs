import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

import Item from './item';

import Sun from '../../resources/images/sun.png';
import LowRain from '../../resources/images/low-rain.png';
import MedRain from '../../resources/images/med-rain.png';
import HighRain from '../../resources/images/high-rain.png';

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

  const history = useHistory();

  const [temperature, setTemperature] = useState('');
  const [minTemperature, setMinTemperature] = useState('');
  const [maxTemperature, setMaxTemperature] = useState('');
  const [pressure, setPressure] = useState('');
  const [humidity, setHumidity] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [gustOfWind, setGustOfWind] = useState('');
  const [windDirection, setWindDirection] = useState('');
  const [precipitation, setPrecipitation] = useState('');
  const [solarIncidence, setSolarIncidence] = useState('');
  const [weatherImg, setWeatherImg] = useState(Sun);

  function handleBack() {
    history.goBack();
  }

  function handleMoreInfo() {
    history.push('/logs');
  }

  async function loadLocalStorage() {
    if (selectedStation === '') {
      const savedSelec = await localStorage.getItem('@weatherData/selectedStation');
      await setSelectedStation(savedSelec);
    }

    if (nameStation === '') {
      const savedName = await localStorage.getItem('@weatherData/nameStation');
      await setNameStation(savedName);
    }
  }

  async function loadLogs() {
    try {
      if (selectedStation !== '') {
        const response = await api.get(`/stations/${selectedStation}/logs`);
        setLogs(response.data);
      }
    } catch (e) {
      toast.error('Erro ao obter os dados da estação');
    }
  }

  function selecImg(precipitation2) {
    if (Number(precipitation2) > 50) {
      return HighRain;
    } if (Number(precipitation2) > 25) {
      return MedRain;
    } if (Number(precipitation2) > 0) {
      return LowRain;
    }
    return Sun;
  }

  function setData() {
    const lastLog = logs[logs.length - 1];
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
      <h2 id="stationTitle">
        Estação Meteorológica -
        {' '}
        {nameStation}
      </h2>
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
        <Item description="Pressão atmosférica" id="pressure" content={`${pressure}hPa`} />
        <Item description="Humidade relativa" id="humidity" content={`${humidity}%`} />
        <Item description="Velocidade do vento" id="windSpeed" content={`${windSpeed}Km/h`} />
        <Item description="Rajada do vento" id="gustOfWind" content={`${gustOfWind}Km/h`} />
        <Item description="Direção do vento" id="windDirection" content={windDirection} />
        <Item description="Precipitação" id="precipitation" content={`${precipitation}mm`} />
        <Item description="Irradiação Solar" id="solarIncidence" content={solarIncidence} />
        <button type="button" id="moreInfo" onClick={handleMoreInfo}>Mais Informações</button>
      </div>
    </div>
  );
};
export default Widget;
