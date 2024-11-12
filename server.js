import http from 'http';
import app from './app/app.js';

//create the serve
const PORT = process.env.PORT || 7000
const server = http.createServer(app)
server.listen(PORT,console.log(`server running on port ${PORT}`)) 