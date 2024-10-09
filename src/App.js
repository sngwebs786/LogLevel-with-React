// src/App.js

import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { log, downloadLogs } from "./utils/logger";

function App() {
  // State to hold API data
  const [data, setData] = useState(null);
  // State to handle loading status
  const [loading, setLoading] = useState(true);
  // State to handle errors
  const [error, setError] = useState(null);

  useEffect(() => {
    log.debug("App component mounted.");

    // Define an asynchronous function to fetch data
    const fetchData = async () => {
      log.info("Starting dummy API call.");
      try {
        // Simulate an API call using JSONPlaceholder
        const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");

        log.debug(`API response status: ${response.status}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        log.info("API call successful.", result);

        // Update state with the fetched data
        setData(result);
      } catch (err) {
        log.error("API call failed.", err);
        setError(err.message);
      } finally {
        log.debug("API call completed.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadLogs = () => {
    downloadLogs();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {loading && <p>Loading data...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {data && (
          <div>
            <h2>{data.title}</h2>
            <p>{data.body}</p>
          </div>
        )}

        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <div style={{ marginTop: "20px" }}>
          <button onClick={handleDownloadLogs}>Download Logs</button>
        </div>
      </header>
    </div>
  );
}

export default App;
