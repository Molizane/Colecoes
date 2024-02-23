import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import winston from 'winston';
import tipoContaRoutes from './routes/TipoContaRoutes.js';

const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'api.log' })],
  format: combine(label({ label: 'api' }), timestamp(), myFormat),
});

const app = express();

//define o dominio de origem para consumo do servico
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('API em execu&ccedil;&atilde;o');
});

app.get('/status', (req, res) => {
  const status = { 'Status': 'On' };
  res.send(status);
});

app.use('/tipoconta', tipoContaRoutes);

const port = process.env.PORT || 9090;

app.listen(port, () => {
  console.log("API executando na porta ", port);
});
