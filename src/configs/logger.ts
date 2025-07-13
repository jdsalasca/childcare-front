import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

// Function to dynamically set the log level based on the environment
const setLogLevel = (): void => {
  const env = import.meta.env.VITE_ENV as string;
  switch (env) {
    case 'development':
      console.log('🚧 Development mode: Setting log level to DEBUG');
      log.setLevel('debug');
      break;
    case 'production':
      console.log('🚀 Production mode: Setting log level to WARN');
      log.setLevel('warn');
      break;
    case 'staging':
      console.log('🔄 Staging mode: Setting log level to INFO');
      log.setLevel('info');
      break;
    default:
      console.log(
        `⚠️ Unknown environment (${env}): Setting log level to ERROR`
      );
      log.setLevel('error');
      break;
  }
};

// Set the log level based on the environment
setLogLevel();

// Configure prefix options
prefix.reg(log);
prefix.apply(log, {
  template: '%t [%l] %n (%f): %m',
  timestampFormatter: (date: Date) => date.toISOString(),
  levelFormatter: (level: string) => {
    const emojiMap: Record<string, string> = {
      trace: '🔍',
      debug: '🐛',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    };
    return `${emojiMap[level] || ''} ${level.toUpperCase()}`;
  },
  nameFormatter: () => '🐻🎓Kayne West 🤴🏿 said:',
  format: (level: string, name: string | undefined, timestamp: Date) =>
    `[${timestamp.toISOString()}] ${level.toUpperCase()} ${name || 'Global'}`,
});

// Custom template for including file and line info
prefix.apply(log, {
  format: (
    level: string,
    name: string | undefined,
    timestamp: Date | string
  ) => {
    // Check if timestamp is a string and convert it to Date if necessary
    const date =
      typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

    // Ensure date is a valid Date object
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error('Invalid timestamp:', timestamp);
      return `[UNKNOWN TIME] ${level.toUpperCase()} ${name || 'Global'}`;
    }

    return `[${date.toISOString()}] ${level.toUpperCase()} ${name || 'Global'}`;
  },
});

// Optionally, set up multiple custom loggers
const customLogger = log.getLogger('myCustomLogger');
customLogger.setLevel('debug');

const anotherLogger = log.getLogger('anotherLogger');
anotherLogger.setLevel('info');

// Export the default logger and custom loggers
export { anotherLogger, customLogger, log };
