import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { jsonViewer } from "./utils";

function App() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ start: 0, end: 10 });
  useEffect(() => {
    fetch("/audit.log")
      .then((res) => console.log(res) || res.text())
      .then((response) => {
        const jsonLogs = response.split("\n").map((x) => JSON.parse(x));
        const sortedLogs = jsonLogs.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );
        setLogs(sortedLogs);
        setFilteredLogs(sortedLogs);
      });
  }, []);
  const goto = useCallback(
    (page) => {
      setCurrentPage(page);
      const start = page * 10 - 10;
      const end = page * 10;
      setPagination({ start, end });
    },
    [pagination]
  );
  return (
    <div>
      <main>
        <div className="max-width-container">
          <h1>Logs Viewer</h1>
          <p>
            choose .json file from your system to view it. You can expand and
            collapse objects and array by clicking on them
          </p>
          {filteredLogs.length > 10 && (
            <div className="pagination-wrapper">
              <div
                className="pagination-item"
                onClick={() => {
                  if (currentPage !== 1) {
                    goto(currentPage - 1);
                  }
                }}
              >{`<<`}</div>
              {new Array(Math.ceil(filteredLogs.length / 10))
                .fill(0)
                .map((x, i) => (
                  <div
                    className={`pagination-item ${
                      currentPage === i + 1 ? "pagination-item__active" : ""
                    }`}
                    onClick={() => goto(i + 1)}
                  >
                    {i + 1}
                  </div>
                ))}
              <div
                className="pagination-item"
                onClick={() => {
                  if (currentPage !== Math.ceil(filteredLogs.length / 10)) {
                    goto(currentPage + 1);
                  }
                }}
              >{`>>`}</div>
            </div>
          )}
          <div class="mt-5">
            <div
              id="target"
              className="box"
              dangerouslySetInnerHTML={{
                __html: jsonViewer(
                  filteredLogs.slice(
                    pagination?.start || 0,
                    pagination?.end || 10
                  )
                ),
              }}
            ></div>
          </div>
        </div>
      </main>
      <footer className="center mt-5">Designed by Vamshi</footer>
    </div>
  );
}

export default App;
