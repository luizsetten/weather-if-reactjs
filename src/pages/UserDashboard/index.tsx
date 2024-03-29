import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  DataTable,
  DataTableRowEditCompleteParams,
} from "primereact/datatable";

import { Column, ColumnEditorOptions } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Panel } from "primereact/panel";
import { InputText } from "primereact/inputtext";
import { toast } from "react-toastify";
import { MdLogout } from "react-icons/md";
import { Button } from "primereact/button";
import { IStation } from "../../types/IStation";
import {
  createStation,
  loadUserStations,
  updateStation,
} from "../../services/api";

export function UserDashboard() {
  const [stations, setStations] = useState<IStation[]>([
    {
      id: "sndfsjndfsjfnsdf",
      name: "sdfsdfsdfsdfsdfg",
    },
  ]);
  const [criarEstacaoCardOpen, setCriarEstacaoCardOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem("@weatherData/userToken");
    navigate("/");
  }

  function verifyUser() {
    const token = sessionStorage.getItem("@weatherData/userToken");

    if (!token) {
      navigate("/");
    }
  }

  async function loadStations() {
    const token = sessionStorage.getItem("@weatherData/userToken");

    if (token) {
      try {
        const { stations: stationsLoaded } = await loadUserStations();
        setStations(stationsLoaded);
      } catch {
        toast.error("Não foi possível carregar as estações deste usuário!");
      }
    }
  }

  useEffect(() => {
    verifyUser();
    loadStations();
  }, []);

  const columns = [
    { field: "id", header: "ID", edit: false },
    { field: "name", header: "Nome", edit: true, type: "text" },
    { field: "location", header: "Localização", edit: true, type: "text" },
    { field: "latitude", header: "Latitude", edit: true, type: "number" },
    { field: "longitude", header: "Longitude", edit: true, type: "number" },
  ];

  const textEditor = (options: ColumnEditorOptions, type?: string) => {
    return (
      <InputText
        type={type}
        value={options.value}
        onChange={(e) =>
          options.editorCallback && options.editorCallback(e.target.value)
        }
      />
    );
  };

  const dynamicColumns = columns.map((col) => {
    if (col.edit)
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          editor={(options) => textEditor(options, col.type)}
        />
      );

    return <Column key={col.field} field={col.field} header={col.header} />;
  });

  const onCreateStation = async () => {
    const station: IStation = {
      name,
      location,
      latitude,
      longitude,
    };
    try {
      const token = sessionStorage.getItem("@weatherData/userToken");
      if (token) await createStation(station, token);
      toast.success("Estação criada com sucesso!");
      loadStations();
    } catch {
      toast.error("Houve um erro ao criar a estação");
    }
  };

  const onRowEditComplete = async (e: DataTableRowEditCompleteParams) => {
    try {
      const { newData } = e;
      await updateStation(newData);
      toast.success("Estação alterada com sucesso!");
      loadStations();
    } catch {
      toast.error("Houve um erro ao atualziar a estação");
    }
  };

  return (
    <div>
      <header className="create-user-header p-mb-3  p-d-flex p-jc-between">
        <h3>Dashboard usuário</h3>
        <MdLogout size={32} className="arrow" onClick={handleLogout} />
      </header>

      <Panel
        header="Criar estação"
        toggleable
        collapsed={criarEstacaoCardOpen}
        onToggle={(e) => setCriarEstacaoCardOpen(e.value)}
      >
        <h3>Nova estação</h3>
        <div className="p-mt-5 p-d-flex p-flex-column p-md-5 p-mx-auto">
          <div className="p-field p-d-flex p-jc-between">
            <label htmlFor="name" className="p-mr-2 p-my-auto">
              Nome
            </label>
            <InputText
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="p-field p-d-flex p-jc-between">
            <label htmlFor="location" className="p-mr-2 p-my-auto">
              Localização
            </label>
            <InputText
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="p-field p-d-flex p-jc-between">
            <label htmlFor="latitude" className="p-mr-2 p-my-auto">
              Latitude
            </label>
            <InputNumber
              id="latitude"
              value={latitude}
              mode="decimal"
              locale="pt-BR"
              minFractionDigits={2}
              onChange={(e) => setLatitude(e.value || 0)}
            />
          </div>

          <div className="p-field p-d-flex p-jc-between">
            <label htmlFor="longitude" className="p-mr-2 p-my-auto">
              Longitude
            </label>
            <InputNumber
              id="longitude"
              value={longitude}
              mode="decimal"
              locale="pt-BR"
              minFractionDigits={2}
              onChange={(e) => setLongitude(e.value || 0)}
            />
          </div>

          <Button
            label="Salvar"
            className="p-my-auto"
            onClick={() => onCreateStation()}
          />
        </div>
      </Panel>

      <div className="p-card p-fluid p-mt-6">
        <DataTable
          value={stations}
          editMode="row"
          dataKey="id"
          onRowEditComplete={onRowEditComplete}
          responsiveLayout="scroll"
        >
          {dynamicColumns}
          <Column
            rowEditor
            headerStyle={{ width: "10%", minWidth: "8rem" }}
            bodyStyle={{ textAlign: "center" }}
          />
        </DataTable>
      </div>
    </div>
  );
}
