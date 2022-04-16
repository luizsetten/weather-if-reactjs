import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./pages/Main";
import Widget from "./pages/Widget";
import Logs from "./pages/Logs";

import { ILog } from "./types/ILog";
import { IStation } from "./types/IStation";

function App() {
  const [stations, setStations] = useState<IStation[]>([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [nameStation, setNameStation] = useState("");
  const [logs, setLogs] = useState<ILog[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  return (
    <BrowserRouter>
      <Routes>
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
                setStations,
                selectedStation,
                setSelectedStation,
              }}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
