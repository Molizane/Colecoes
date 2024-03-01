import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import winston from 'winston';
import tipoContaRoutes from './routes/TipoContaRoutes.js';
import contaRoutes from './routes/ContaRoutes.js';
import lanctoRoutes from './routes/LanctoRoutes.js';

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
  res.send('<h1>API em execu&ccedil;&atilde;o</h1>');
});

app.get('/status', (req, res) => {
  res.send({ 'status': 'on' });
});

app.use('/api/tipoconta', tipoContaRoutes);
app.use('/api/conta', contaRoutes);
app.use('/api/lancto', lanctoRoutes);

const port = process.env.PORT || 9090;

app.listen(port, () => {
  console.log("API executando na porta ", port);
});
