import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import {
  LineChart,
  XAxis,
  Tooltip,
  CartesianGrid,
  Line,
} from 'recharts'; // http://recharts.org/en-US/guide/getting-started

import Graph from './graph';
import api from '../../services/axios';

import './styles.css';

const Logs = ({ props }) => {
  const {
    nameStation,
    setNameStation,
    selectedStation,
    setSelectedStation,
    logs,
    setLogs,
  } = props;
  const [data, setData] = useState([]);
  const history = useHistory();

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
      console.log(e);
      toast.error('Erro ao obter os dados da estação');
    }
  }

  function handleBack() {
    history.goBack();
  }

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  function handleExportCSV() {
    console.log('Deve exportar os logs');
  }

  useEffect(() => {
    loadLocalStorage();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [selectedStation]);

  useEffect(() => {
    setData(logs);
  }, [logs]);

  return (
    <div className="container">
      <FaArrowLeft size={32} className="arrow" onClick={handleBack} />
      <h2 id="stationTitle">
        Estação Meteorológica -
        {' '}
        {nameStation}
      </h2>
      <ToastContainer />
      <div id="graphGroup">
        <Graph data={data} dataKey="temperature" title="Temperatura" color="#ff0000" />
        <Graph data={data} dataKey="humidity" title="Humidade relativa" color="#0000ff" />
        <Graph data={data} dataKey="pressure" title="Pressão Atmosférica" color="#00ff00" />
        <Graph data={data} dataKey="windspeed" title="Velocidade do vento" color="#999999" />
        <Graph data={data} dataKey="gustofwind" title="Rajada do vento" color="#666666" />
        <Graph data={data} dataKey="precipitation" title="Precipitação" color="#0000ff" />
        <Graph data={data} dataKey="solarincidence" title="Irradiação solar" color="#ffff00" />
      </div>
      <button onClick={handleExportCSV}>Exportar .CSV</button>

    </div>
  );
};

export default Logs;
