/* eslint-disable no-unused-vars */
import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';
// Function to dynamically set the log level based on the environment
const setLogLevel = () => {
  const env = import.meta.env.VITE_ENV;
  switch (env) {
    case 'development':
      console.log('🚧 Development mode: Setting log level to DEBUG');
      log.setLevel('debug'); // Show all logs in development
      break;
    case 'production':
      console.log('🚀 Production mode: Setting log level to WARN');
      log.setLevel('warn'); // Show warnings and errors in production
      break;
    case 'staging':
      console.log('🔄 Staging mode: Setting log level to INFO');
      log.setLevel('info'); // Show info, warnings, and errors in staging
      break;
    default:
      console.log(`⚠️ Unknown environment (${env}): Setting log level to ERROR`);
      log.setLevel('error'); // Default to errors only
      break;
  }
};
// Helper function to extract the calling file and line number
const getCallerInfo = () => {
  try {
    const stack = new Error().stack;
    const callerLine = stack.split('\n')[3]; // The third line of the stack trace
    const match = callerLine.match(/(?:\()([^()]+)\)?/); // Regex to extract file, line, and column info
    console.log("match", match);
    return match ? match[1] : '';
    // Example output: 'src/utils/logger.js:123:45'
  } catch (error) {
    return '';
  }
};
// Set the log level based on the environment
setLogLevel();
// Configure prefix options
prefix.reg(log);
prefix.apply(log, {
  template: '%t [%l] %n (%f): %m', // Adding %f for file info
  timestampFormatter: (date) => date.toISOString(),
  levelFormatter: (level) => {
    const emojiMap = {
      trace: '🔍',
      debug: '🐛',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    };
    return `${emojiMap[level] || ''} ${level.toUpperCase()}`;
  },
  // nameFormatter: (name) => name || 'Global',
  nameFormatter: () => '🐻🎓Kayne West 🤴🏿 said:',
  format: (level, name, timestamp) => `[${timestamp}] ${level.toUpperCase()} ${name}:`,
  levels: {
    trace: { color: 'cyan' },
    debug: { color: 'blue' },
    info: { color: 'green' },
    warn: { color: 'yellow' },
    error: { color: 'red' }
  }
});
// Custom template for including file and line info
prefix.apply(log, {
  format(level, name, timestamp) {
    // const callerInfo = getCallerInfo(); // Get file and line info
    // return `[${timestamp}] ${level.toUpperCase()} ${name || 'Global'} (${callerInfo}):`;
    return `[${timestamp}] ${level.toUpperCase()} ${name || 'Global'}`;
  }
});
// Optionally, set up multiple custom loggers
const customLogger = log.getLogger('myCustomLogger');
customLogger.setLevel('debug'); // Custom logger with different level

const anotherLogger = log.getLogger('anotherLogger');
anotherLogger.setLevel('info'); // Different log level for another logger

// Export the default logger and custom loggers
export { anotherLogger, customLogger, log };

// Example usage of custom loggers
log.debug('🐛 This is a global debug message');
customLogger.info('ℹ️ This is an info message from customLogger');
anotherLogger.warn('⚠️ This is a warning from anotherLogger');
