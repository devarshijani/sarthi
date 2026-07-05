const dotenv = require('dotenv');
dotenv.config();

const validateEnv = require('./config/validateEnv');
validateEnv();

const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});