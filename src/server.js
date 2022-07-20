import Logger from './config/logger.js';
import app from './api/index.js';
import * as url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const log = Logger(__filename);

app.listen(3000, () => {
    log.info('Servidor corriendo en el puerto 3000');
});