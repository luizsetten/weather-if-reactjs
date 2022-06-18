import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ReactJson from "react-json-view";
import {
  DataTable,
  DataTableRowEditCompleteParams,
} from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Panel } from "primereact/panel";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { toast } from "react-toastify";
import { MdLogout } from "react-icons/md";
import { Button } from "primereact/button";
import { IStation } from "../../types/IStation";
import {
  createStation,
  listUsers,
  loadUserStations,
  runCommandSQL,
  updateStation,
  updateUser,
} from "../../services/api";
import { IUser } from "../../types/IUser";

export function AdminDashboard() {
  const [stations, setStations] = useState<IStation[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [criarEstacaoCardOpen, setCriarEstacaoCardOpen] = useState(false);
  const [name, setName] = useState("");
  const [sqlCommand, setSqlCommand] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [sqlResponse, setSqlResponse] = useState({});

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
    try {
      const { stations: stationsLoaded } = await loadUserStations();
      setStations(stationsLoaded);
    } catch {
      toast.error("Não foi possível carregar as estações deste usuário!");
    }
  }

  async function loadUsers() {
    const token = sessionStorage.getItem("@weatherData/userToken");

    if (token) {
      try {
        const { users: usersLoaded } = await listUsers();
        setUsers(usersLoaded);
      } catch {
        toast.error("Não foi possível carregar as estações deste usuário!");
      }
    }
  }

  useEffect(() => {
    verifyUser();
    loadStations();
    loadUsers();
  }, []);

  const columns = [
    { field: "id", header: "ID", edit: false },
    { field: "name", header: "Nome", edit: true, type: "text" },
    { field: "location", header: "Localização", edit: true, type: "text" },
    { field: "latitude", header: "Latitude", edit: true, type: "number" },
    { field: "longitude", header: "Longitude", edit: true, type: "number" },
    { field: "user", header: "Proprietário", edit: false, type: "text" },
  ];

  const columnsUser = [
    { field: "id", header: "ID", edit: false },
    { field: "email", header: "E-mail", edit: true, type: "email" },
    {
      field: "role",
      header: "Função",
      edit: true,
      type: "dropdown",
      options: ["admin", "user", "disabled"],
    },
  ];

  const textEditor = (
    options: ColumnEditorOptions,
    type?: string,
    optionsDropdown?: string[]
  ) => {
    if (type === "dropdown") {
      return (
        <Dropdown
          type={type}
          value={options.value}
          options={optionsDropdown}
          onChange={(e) =>
            options.editorCallback && options.editorCallback(e.target.value)
          }
        />
      );
    }
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

  const dynamicColumnsUsers = columnsUser.map((col) => {
    if (col.edit)
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          editor={(options) => textEditor(options, col.type, col.options)}
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
      if (token) await createStation(station);
      toast.success("Estação criada com sucesso!");
      loadStations();
    } catch {
      toast.error("Houve um erro ao criar a estação");
    }
  };

  const onExecuteCommand = async () => {
    try {
      const token = sessionStorage.getItem("@weatherData/userToken");
      if (token) {
        const resposta = await runCommandSQL(sqlCommand);
        setSqlResponse(resposta);
      }
    } catch {
      toast.error("Houve um erro ao executar o comando");
    }
  };

  const onRowEditStationComplete = async (
    e: DataTableRowEditCompleteParams
  ) => {
    try {
      const { newData } = e;
      await updateStation(newData);
      toast.success("Estação alterada com sucesso!");
      loadStations();
    } catch {
      toast.error("Houve um erro ao atualziar a estação");
    }
  };

  const onRowEditUserComplete = async (e: DataTableRowEditCompleteParams) => {
    try {
      const { newData } = e;
      await updateUser(newData);
      toast.success("Usuário alterado com sucesso!");
      loadUsers();
    } catch {
      toast.error("Houve um erro ao atualziar o usuário");
    }
  };

  return (
    <div>
      <header className="create-user-header p-mb-3 p-d-flex p-jc-between">
        <h3>Dashboard administrador</h3>
        <MdLogout size={32} className="arrow" onClick={handleLogout} />
      </header>

      <Panel
        header="Criar estação"
        toggleable
        collapsed={criarEstacaoCardOpen}
        onToggle={(e) => setCriarEstacaoCardOpen(e.value)}
      >
        <h3>Nova estação</h3>
        <div className="p-mt-5 p-d-flex p-flex-column p-sm-6 p-mx-auto">
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
          header="Estações"
          dataKey="id"
          onRowEditComplete={onRowEditStationComplete}
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

      <div className="p-card p-fluid p-my-6">
        <DataTable
          value={users}
          editMode="row"
          header="Usuários"
          dataKey="id"
          onRowEditComplete={onRowEditUserComplete}
          responsiveLayout="scroll"
        >
          {dynamicColumnsUsers}
          <Column
            rowEditor
            headerStyle={{ width: "10%", minWidth: "8rem" }}
            bodyStyle={{ textAlign: "center" }}
          />
        </DataTable>
      </div>

      <Panel
        header="Executar consulta SQL"
        toggleable
        collapsed={criarEstacaoCardOpen}
        onToggle={(e) => setCriarEstacaoCardOpen(e.value)}
      >
        <div className="p-field p-d-flex p-jc-between">
          <InputTextarea
            id="sqlCommand"
            value={sqlCommand}
            onChange={(e) => setSqlCommand(e.target.value)}
            style={{ display: "flex", flex: "1" }}
          />
        </div>

        <Button
          label="Executar"
          className="p-my-auto"
          onClick={() => onExecuteCommand()}
        />

        <div className="p-my-6">
          <ReactJson src={sqlResponse} />
        </div>
      </Panel>
    </div>
  );
}
