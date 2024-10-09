// src/utils/logger.js

import log from "loglevel";

// Configuration: Set the log destination ('console' or 'file')
// const LOG_DESTINATION = process.env.REACT_APP_LOG_DESTINATION || "console";
const LOG_DESTINATION =
  process.env.REACT_APP_MODE === "prod" ? "file" : "console";

// Buffer to store logs when destination is 'file'
let logBuffer = [];

// Override loglevel's methodFactory to customize logging behavior
const originalFactory = log.methodFactory;

// Modify methodFactory based on log destination
log.methodFactory = (methodName, logLevel, loggerName) => {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);

  return function (message, ...args) {
    // Format the log message with timestamp, level, and variable values
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${methodName.toUpperCase()}] ${message}`;
    const variableValues =
      args.length > 0 ? ` | Variables: ${JSON.stringify(args)}` : "";

    // Log the message with variable values
    const finalMessage = formattedMessage + variableValues;

    if (LOG_DESTINATION === "file") {
      // If destination is file, push to log buffer only
      logBuffer.push(finalMessage);
    } else {
      // If destination is console, log to console as well
      rawMethod(finalMessage);
    }
  };
};

// Set the default log level based on the environment
log.setLevel(
  process.env.NODE_ENV === "production"
    ? "warn"
    : process.env.REACT_APP_LOG_LEVEL || "debug"
);

// Function to download logs as a .txt file
const downloadLogs = () => {
  if (LOG_DESTINATION !== "file") {
    log.warn(
      'Log download is only available when LOG_DESTINATION is set to "file".'
    );
    return;
  }

  const blob = new Blob([logBuffer.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `logs_${new Date().toISOString()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// Function to expose to the console
window.downloadLogs = downloadLogs;
export { log, downloadLogs };
