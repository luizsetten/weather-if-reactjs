import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

import Main from './pages/Main';
import Widget from './pages/Widget';
import Logs from './pages/Logs';

function App() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [nameStation, setNameStation] = useState('');
  const [logs, setLogs] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Main</Link>
            </li>
            <li>
              <Link to="/widget">Widget</Link>
            </li>
            <li>
              <Link to="/logs">Logs</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/widget">
            <Widget props={{
              logs, setLogs, selectedStation, setSelectedStation, nameStation, setNameStation,
            }}
            />
          </Route>
          <Route path="/logs">
            <Logs props={{
              selectedStation, startDate, setStartDate, endDate, setEndDate,
            }}
            />
          </Route>
          <Route path="/">
            <Main props={{
              setNameStation,
              stations,
              setStations,
              selectedStation,
              setSelectedStation,
            }}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
