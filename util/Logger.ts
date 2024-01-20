enum LoggerColours {
  SUCCESS = '\x1b[36m',
  ERROR = '\x1b[31m',
  WARNING = '\x1b[33m',
  TIMECOUNT = '\x1b[35m',
}
const Logger = {
  Log: (message: string, ...args: unknown[]) => {
    if (__DEV__) {
      console.log(logMessage(message), ...args);
    }
  },
  Success: (message: string, ...args: unknown[]) => {
    if (__DEV__) {
      console.log(LoggerColours.SUCCESS, logMessage(message), ...args);
    }
  },
  Error: (message: string, ...args: unknown[]) => {
    if (__DEV__) {
      console.log(LoggerColours.ERROR, logMessage(message), ...args);
    }
  },
  Warn: (message: string, ...args: unknown[]) => {
    if (__DEV__) {
      console.log(LoggerColours.WARNING, logMessage(message), ...args);
    }
  },
};
export default Logger;

function logMessage(message: string): string {
  return `[${new Date().toLocaleTimeString()}] ${message}`;
}
