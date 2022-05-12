import React, { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Login } from "../../components/Login";

import { IStation } from "../../types/IStation";

import "./styles.css";

interface IMainProps {
  props: {
    setNameStation: (a: string) => void;
    selectedStation: string;
    setSelectedStation: (a: string) => void;
    stations: IStation[];
  };
}

function Main({ props }: IMainProps) {
  const { stations, setNameStation, selectedStation, setSelectedStation } =
    props;

  const navigate = useNavigate();

  function handleSelect(e: ChangeEvent<HTMLSelectElement>) {
    const select = e.target.value;
    const { name } = stations[e.target.selectedIndex - 1];
    localStorage.setItem("@weatherData/selectedStation", select);
    localStorage.setItem("@weatherData/nameStation", name);
    setSelectedStation(select);
    setNameStation(name);
  }

  function handleClick() {
    if (selectedStation === "") {
      toast.error("Selecione uma estação válida");
    } else {
      navigate("/widget");
    }
  }

  const stationList = stations.map((station: IStation) => (
    <option value={station.id} key={station.id}>
      {station.name}
    </option>
  ));

  return (
    <div className="container_main">
      <div className="container">
        <h2 id="message">Autentique-se</h2>
        <Login />
      </div>
      <h2 id="message">OU</h2>

      <div className="container">
        <h2 id="message">Selecione uma estação abaixo</h2>
        <select id="station_selector" onChange={(e) => handleSelect(e)}>
          <option value="">Selecionar estação</option>
          {stationList}
        </select>
        <button type="button" onClick={handleClick}>
          Carregar
        </button>
      </div>
    </div>
  );
}

export default Main;
