import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeParams } from "primereact/dropdown";
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
  const [optionSelected, setOptionSelected] = useState<IStation>();
  const { stations, setNameStation, selectedStation, setSelectedStation } =
    props;

  const navigate = useNavigate();

  function handleSelect(e: DropdownChangeParams) {
    const select = e.value.id;
    const { name } = e.value;
    localStorage.setItem("@weatherData/selectedStation", select);
    localStorage.setItem("@weatherData/nameStation", name);
    setOptionSelected(e.value);
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

  return (
    <div className="p-grid p-d-flex p-ai-center p-my-auto">
      <div className="p-col p-d-flex p-flex-column">
        <h2 className="p-mb-4">Autentique-se</h2>
        <Login />
      </div>
      <h2 className="p-col">OU</h2>

      <div className="p-col p-d-flex p-flex-column">
        <h2 className="p-mb-4">Selecione uma estação abaixo</h2>
        <Dropdown
          optionLabel="name"
          value={optionSelected}
          options={stations}
          onChange={(e) => handleSelect(e)}
          placeholder="Selecionar estação"
          className="p-mb-5"
        />
        <Button label="Carregar" onClick={handleClick} />
      </div>
    </div>
  );
}

export default Main;
