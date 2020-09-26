import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../../services/axios';

import './styles.css';

const Main = ({ props }) => {
  const {
    stations,
    setStations,
    setNameStation,
    selectedStation,
    setSelectedStation,
  } = props;

  const history = useHistory();

  async function loadStations() {
    try {
      const response = await api.get('/stations');
      setStations(response.data.stations);
    } catch (e) {
      toast.error('Erro ao carregar os parametros, recarregue a página');
    }
  }

  useEffect(() => {
    loadStations();
  }, []);

  async function handleSelect() {
    const select = document.getElementById('station_selector').value;
    const { name } = stations[document.getElementById('station_selector').selectedIndex - 1];
    await localStorage.setItem('@weatherData/selectedStation', select);
    await localStorage.setItem('@weatherData/nameStation', name);
    setSelectedStation(select);
    setNameStation(name);
  }

  function handleClick(e) {
    e.preventDefault();
    if (selectedStation === '') {
      toast.error('Selecione uma estação válida');
    } else {
      history.push('/widget');
    }
  }

  const stationList = stations.map((station) => (
    <option value={station.id} key={station.id}>{station.name}</option>
  ));

  return (
    <div className="container">
      <ToastContainer />
      <select id="station_selector" onChange={(e) => handleSelect(e)}>
        <option value="">Selecione uma estação</option>
        {stationList}
      </select>
      <button type="button" onClick={(e) => handleClick(e)}>Carregar</button>
    </div>
  );
};

export default Main;
