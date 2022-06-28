import { existsSync, mkdirSync } from 'fs';
import { sep, join } from 'path';
import moment from 'moment-timezone';
import { createLogger, format, transports } from "winston";
import { get } from 'express-http-context';

/* Determinando el entorno */
const enviroment = process.env.NODE_ENV || 'local';

/* Cargando variables de entorno */
import config from './enviroments.js';

/* { error: 5, warn: 4, info: 3, verbose: 2, debug: 1, silly: 0 } */
const level = config.logLevel;
const timezoneConfigured = moment().tz(config.timezone);
const myTimestamp = timezoneConfigured.format().slice(0, 19).replace("T", " ");

const getLabel = function (modulePath) {
    const parts = modulePath.split(sep);
    return join(parts[parts.length - 2], parts.pop());
};

/* Mostrando el nivel del log */
console.info(`${myTimestamp} - Configurando Logger global [${level}] [Winston]`);
console.info(`${myTimestamp} - Logger global configurado`);

/* Exportando Logger como función */
export default function (callingModule) {

    /* Crea el directorio de logs si no existiera */
    if (!existsSync(config.logPath)) {
        mkdirSync(config.logPath);
    }

    const filenameE = join(config.logPath, 'error.log');
    const filename = join(config.logPath, 'app.log');


    /* Definiendo el formato del log */
    let formatParams = (info) => {
        const { timestamp, level, message, ...args } = info;
        let label = getLabel(callingModule)

        let reqId = get('reqId');
        let msg = `${myTimestamp} ${level} [${label}]: ${message} ${Object.keys(args).length
            ? JSON.stringify(args, "", "")
            : ""}`;

        let msgUID = `${myTimestamp} ${level} [${label}]-[${reqId}]: ${message} ${Object.keys(args).length
            ? JSON.stringify(args, "", "")
            : ""}`;

        // return (reqId) ? msgUID : msg;
        return msg;
    }

    /* Asignando configuraciones de formato de acuerdo al ambiente */
    const localFormat = format.combine(
        format.colorize(),
        format.timestamp(),
        format.align(),
        format.printf(formatParams)
    );

    const developmentFormat = format.combine(
        format.timestamp(),
        format.align(),
        format.printf(formatParams)
    );

    const staggingFormat = format.combine(
        format.timestamp(),
        format.align(),
        format.printf(formatParams)
    );

    const productionFormat = format.combine(
        format.timestamp(),
        format.align(),
        format.printf(formatParams)
    );

    let logger;

    switch (enviroment) {
        case 'local':
            logger = createLogger({
                level: level,
                format: localFormat,
                transports: [
                    new transports.Console()
                ]
            });
            break;
        case 'development':
            logger = createLogger({
                level: level,
                format: developmentFormat,
                transports: [
                    new transports.Console(),
                    new transports.File({ filename: filenameE, level: "error" }),
                    new transports.File({ filename })
                ]
            });
            break;
        case 'stagging':
            logger = createLogger({
                level: level,
                format: staggingFormat,
                transports: [
                    new transports.Console(),
                    new transports.File({ filename: filenameE, level: "error" }),
                    new transports.File({ filename })
                ]
            });
            break;
        case 'production':
            logger = createLogger({
                level: level,
                format: productionFormat,
                transports: [
                    new transports.Console(),
                    new transports.File({ filename: filenameE, level: "error" }),
                    new transports.File({ filename })
                ]
            });
            break;
        default:
            break;
    }

    logger.error('Error Logger configured');
    logger.warn('Warn Logger configured');
    logger.info('Info Logger configured');
    logger.debug('Debug Logger configured');
    logger.verbose('Verbose Logger configured');
    logger.silly('Silly Logger configured');


    return logger
};
