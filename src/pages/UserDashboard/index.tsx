/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  DataTable,
  DataTableRowEditCompleteParams,
} from "primereact/datatable";

import { Column, ColumnEditorOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { toast } from "react-toastify";
import { MdLogout } from "react-icons/md";
import { IStation } from "../../types/IStation";
import { loadUserStations, updateStation } from "../../services/api";

export function UserDashboard() {
  const [stations, setStations] = useState<IStation[]>([
    {
      id: "sndfsjndfsjfnsdf",
      name: "sdfsdfsdfsdfsdfg",
    },
  ]);
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
        const { stations: stationsLoaded } = await loadUserStations(token);
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

  const onRowEditComplete = async (e: DataTableRowEditCompleteParams) => {
    try {
      const { newData } = e;
      const token = sessionStorage.getItem("@weatherData/userToken");
      if (token) await updateStation(newData, token);
      toast.success("Estação alterada com sucesso!");
      loadStations();
    } catch {
      toast.error("Houve um erro ao atualziar a estação");
    }
  };

  return (
    <div>
      <header className="create-user-header p-mb-3">
        <h3>Dashboard usuário</h3>
        <MdLogout size={32} className="arrow" onClick={handleLogout} />
      </header>
      <div className="p-card p-fluid">
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
