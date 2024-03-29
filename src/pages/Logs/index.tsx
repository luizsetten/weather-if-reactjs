import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { addDays, addMonths, differenceInDays, format } from "date-fns";
import { Button } from "primereact/button";
import MultiGraph from "./multiGraph";
import Graph from "./graph";
import { downloadLogs, loadLogs } from "../../services/api";
import { IRecord } from "../../types/IRecord";

import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";
import { ILog } from "../../types/ILog";

interface IRecordsProps {
  props: {
    nameStation: string;
    setNameStation: (a: string) => void;
    selectedStation: string;
    setSelectedStation: (a: string) => void;
    logs: IRecord[];
    setLogs: (a: IRecord[]) => void;
    startDate: Date;
    setStartDate: (a: Date) => void;
    endDate: Date;
    setEndDate: (a: Date) => void;
  };
}

function Logs({ props }: IRecordsProps) {
  const { nameStation, selectedStation } = props;
  const [data, setData] = useState<ILog[]>([]);
  const [startDate, setStartDate] = useState(
    addDays(addMonths(new Date(), -2), 1)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [showGraph, setShowGraph] = useState(true);
  const navigate = useNavigate();

  async function setLogs() {
    try {
      if (selectedStation !== "") {
        const logs = await loadLogs(
          selectedStation,
          startDate.toISOString(),
          endDate.toISOString()
        );

        setData(
          logs.map((log) => ({
            ...log,
            reference_date: format(
              new Date(log.reference_date),
              "dd/MM/yy HH:mm"
            ),
            created_at: format(new Date(log.created_at), "dd/MM/yy HH:mm"),
          }))
        );
      }
    } catch (e) {
      toast.error("Erro ao obter os dados da estação");
    }
  }

  function handleBack() {
    navigate(-1);
  }

  useEffect(() => {
    setShowGraph(differenceInDays(endDate, startDate) <= 60);
    if (differenceInDays(endDate, startDate) <= 60) setLogs();
  }, [selectedStation, startDate, endDate]);

  async function download() {
    const blob = await downloadLogs(
      selectedStation,
      startDate.toISOString(),
      endDate.toISOString()
    );

    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `logs.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }
  return (
    <div className="container p-mb-5">
      <Button
        icon="pi pi-arrow-left"
        iconPos="right"
        className="p-button-raised p-button-rounded p-as-start p-ml-5"
        onClick={handleBack}
      />
      <h2 className="p-mb-4">Estação Meteorológica - {nameStation}</h2>
      <div id="filter">
        <div className="filterItem">
          <span>Data inicial</span>
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            showTimeSelect
            maxDate={endDate}
            timeFormat="HH:mm"
            timeIntervals={60}
            timeCaption="time"
            dateFormat="dd/MM/yyyy HH:00"
          />
        </div>

        <div className="filterItem">
          <span>Data final</span>
          <DatePicker
            selected={endDate}
            minDate={startDate}
            maxDate={new Date()}
            onChange={(date: Date) => setEndDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={60}
            timeCaption="time"
            dateFormat="dd/MM/yyyy HH:00"
          />
        </div>
      </div>
      <small>
        Para intervalos maiores que 60 dias não é possível visualizar os
        gráficos, apenas exportar os dados.
      </small>
      {showGraph && (
        <div id="graphGroup">
          <MultiGraph
            data={data.map((log) => ({
              reference_date: log.reference_date,
              avg: log.temperature_avg,
              max: log.temperature_max,
              min: log.temperature_min,
            }))}
            title="Temperatura"
            unit="°C"
          />

          <MultiGraph
            data={data.map((log) => ({
              reference_date: log.reference_date,
              avg: log.humidity_avg,
              max: log.humidity_max,
              min: log.humidity_min,
            }))}
            title="Umidade relativa"
            unit="%"
          />
          <MultiGraph
            data={data.map((log) => ({
              reference_date: log.reference_date,
              avg: log.pressure_avg,
              max: log.pressure_max,
              min: log.pressure_min,
            }))}
            title="Pressão Atmosférica"
            unit="Pa"
          />
          <MultiGraph
            data={data.map((log) => ({
              reference_date: log.reference_date,
              avg: log.wind_speed_avg,
              max: log.wind_speed_max,
              min: log.wind_speed_min,
            }))}
            title="Velocidade do vento"
            unit="m/s"
          />
          <MultiGraph
            data={data.map((log) => ({
              reference_date: log.reference_date,
              avg: log.wind_speed_avg * 2.7,
              max: log.wind_speed_max * 2.7,
              min: log.wind_speed_min * 2.7,
            }))}
            title="Rajada do vento"
            unit="m/s"
          />
          <Graph
            data={data.map((log) => ({
              reference_date: log.reference_date,
              value: log.wind_direction_avg,
            }))}
            title="Direção do vento"
            unit="°"
            color="#99c9f9"
          />
          <Graph
            data={data.map((log) => ({
              reference_date: log.reference_date,
              value: log.precipitation_acc,
            }))}
            title="Precipitação"
            unit="mm"
            color="#3399ff"
          />
          <MultiGraph
            data={data.map((log) => ({
              reference_date: log.reference_date,
              avg: log.solar_incidence_avg,
              max: log.solar_incidence_max,
              min: log.solar_incidence_min,
            }))}
            title="Irradiação solar"
            unit="mW/m²"
          />
        </div>
      )}
      <Button label="Download .csv" onClick={download} />
    </div>
  );
}

export default Logs;
