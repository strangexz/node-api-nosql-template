import express, { Router, json, urlencoded } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { v1 as uuidv1 } from 'uuid';
import httpContext from 'express-http-context';


/* Inicializando express */
const router = Router();
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

/* Configuración del CORS */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
    res.header('Access-Control-Methods', 'GET', 'POST', 'OPTIONS', 'PATCH');
    res.header('Allow', 'GET', 'POST', 'OPTIONS', 'PATCH');

    next();
});
app.use(cors());

/* Capturando url's inexistentes */
app.use((req, res, next) => {
    log.warn('Solicitud a endpoint incorrecto o inexistente');
    res.status(502).json({
        code: 309,
        message: 'Endpoint incorrecto o inexistente',
        result: []
    });
});

export default app;