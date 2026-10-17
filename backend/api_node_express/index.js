const http = require('http');
const app = require('./server');
const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';

app.set('port', port);

const server = http.createServer(app);

server.listen(port, host, () => {
  console.log(`Servidor corriendo en http://${host}:${port}`);
});