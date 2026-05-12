const env = require('./config/env');
const app = require('./app');
const logger = require('./utils/logger');

const server = app.listen(env.port, () => {
  logger.info(`Servidor corriendo en puerto ${env.port} (${env.nodeEnv})`);
});

function shutdown(signal) {
  logger.info(`${signal} recibido. Cerrando servidor...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => logger.error('Unhandled rejection:', err));
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err);
  process.exit(1);
});
