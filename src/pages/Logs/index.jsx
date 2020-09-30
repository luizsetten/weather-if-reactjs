/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import CsvDownload from 'react-json-to-csv';
import DatePicker from 'react-datepicker';
import Graph from './graph';
import api from '../../services/axios';

import 'react-datepicker/dist/react-datepicker.css';
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
  const [startDate, setStartDate] = useState(new Date('2019'));
  const [endDate, setEndDate] = useState(new Date());
  const history = useHistory();
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

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

  function handleBack() {
    history.goBack();
  }

  useEffect(() => {
    loadLocalStorage();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [selectedStation]);

  useEffect(() => {
    const temp = [];
    logs.map((log) => {
      const logDate = new Date(log.createdAt);
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
      <h2 id="stationTitle">
        Estação Meteorológica -
        {' '}
        {nameStation}
      </h2>
      <ToastContainer />
      <div id="filter">
        <div className="filterItem">
          <span>Data inicial</span>
          <DatePicker
            selected={new Date('2020')}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </div>

        <div className="filterItem">
          <span>Data final</span>
          <DatePicker
            selected={new Date()}
            onChange={(date) => setEndDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </div>

        <div className="filterItem">
          <span>Filtrar</span>
          <label className="switch" htmlFor="checkbox">
            <input type="checkbox" id="checkbox" onChange={(e) => setIsFiltering(e.target.checked)} />
            <span className="slider round" />
          </label>
        </div>

      </div>
      <div id="graphGroup">
        <Graph data={data} dataKey="temperature" title="Temperatura" unit="°C" color="#ff0000" />
        <Graph data={data} dataKey="humidity" title="Humidade relativa" unit="%" color="#0000ff" />
        <Graph data={data} dataKey="pressure" title="Pressão Atmosférica" unit="hPa" color="#00ff00" />
        <Graph data={data} dataKey="windspeed" title="Velocidade do vento" unit="Km/h" color="#999999" />
        <Graph data={data} dataKey="gustofwind" title="Rajada do vento" unit="Km/h" color="#666666" />
        <Graph data={data} dataKey="winddirection" title="Direção do vento" unit="°" color="#3399ff" />
        <Graph data={data} dataKey="precipitation" title="Precipitação" unit="mm" color="#bb00ff" />
        <Graph data={data} dataKey="solarincidence" title="Irradiação solar" unit="%" color="#af5500" />
      </div>
      <CsvDownload data={data} filename="station_logs.csv">Exportar .csv</CsvDownload>

    </div>
  );
};

export default Logs;
