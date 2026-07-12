const dotenv = require('dotenv');
dotenv.config();

const validateEnv = require('./config/validateEnv');
validateEnv();

const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const rideExpiry = require('./services/rideExpiry');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = initializeSocket(server);
rideExpiry.start(io);

server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});