import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

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
      alert('Erro ao carregar os parametro, recarregue a página');
    }
  }

  useEffect(() => {
    loadStations();
  });

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
      alert('Selecione uma estação válida'); // Colocar um toast
    } else {
      history.push('/widget');
    }
  }

  const stationList = stations.map((station) => (
    <option value={station.id} key={station.id}>{station.name}</option>
  ));

  return (
    <>
      <select id="station_selector" onChange={(e) => handleSelect(e)}>
        <option value="">Selecione uma estação</option>
        {stationList}
      </select>
      <button type="button" onClick={(e) => handleClick(e)}>Carregar</button>
    </>
  );
};

export default Main;
