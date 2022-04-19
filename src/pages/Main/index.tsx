import React, { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  async function handleSelect(e: ChangeEvent<HTMLSelectElement>) {
    const select = e.target.value;
    const { name } = stations[e.target.selectedIndex - 1];
    await localStorage.setItem("@weatherData/selectedStation", select);
    await localStorage.setItem("@weatherData/nameStation", name);
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
    <div className="container">
      <ToastContainer />
      <h2 id="message">Selecione uma estação abaixo</h2>
      <select id="station_selector" onChange={(e) => handleSelect(e)}>
        <option value="">Selecionar estação</option>
        {stationList}
      </select>
      <button type="button" onClick={handleClick}>
        Carregar
      </button>
    </div>
  );
}

export default Main;
