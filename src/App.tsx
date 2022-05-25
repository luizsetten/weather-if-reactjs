import React, { useState, createContext, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import Main from "./pages/Main";
import Widget from "./pages/Widget";
import Logs from "./pages/Logs";

import { IRecord } from "./types/IRecord";
import { IStation } from "./types/IStation";
import api from "./config/axios";
import { CreateUser } from "./pages/CreateUser";
import { UserDashboard } from "./pages/UserDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";

function App() {
  const [stations, setStations] = useState<IStation[]>([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [nameStation, setNameStation] = useState("");
  const [logs, setLogs] = useState<IRecord[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const context = useMemo(() => {
    return { station_id: selectedStation, name: nameStation };
  }, [selectedStation, nameStation]);

  const StationContext = createContext(context);

  const loadLocalStorage = () => {
    if (!selectedStation) {
      const savedStation = localStorage.getItem("@weatherData/selectedStation");
      const nameSaved = localStorage.getItem("@weatherData/nameStation");
      if (savedStation) setSelectedStation(savedStation);
      if (nameSaved) setNameStation(nameSaved);
    }
  };

  async function loadStations() {
    try {
      const { data } = await api.get("/stations");
      setStations(data.stations);
    } catch (e) {
      toast.error("Erro ao carregar os parametros, recarregue a página");
    }
  }

  useEffect(() => {
    loadStations();
    loadLocalStorage();
  }, []);

  return (
    <>
      <ToastContainer />
      <StationContext.Provider value={context}>
        <BrowserRouter>
          <Routes>
            <Route path="/createUser" element={<CreateUser />} />
            <Route path="/userDashboard" element={<UserDashboard />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route
              path="/widget"
              element={
                <Widget
                  props={{
                    logs,
                    setLogs,
                    selectedStation,
                    setSelectedStation,
                    nameStation,
                    setNameStation,
                  }}
                />
              }
            />
            <Route
              path="/logs"
              element={
                <Logs
                  props={{
                    nameStation,
                    setNameStation,
                    selectedStation,
                    setSelectedStation,
                    startDate,
                    setStartDate,
                    endDate,
                    setEndDate,
                    logs,
                    setLogs,
                  }}
                />
              }
            />
            <Route
              path="/"
              element={
                <Main
                  props={{
                    setNameStation,
                    stations,
                    selectedStation,
                    setSelectedStation,
                  }}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </StationContext.Provider>
    </>
  );
}

export default App;
