const http = require('http');
const db = require('./db.js');

// Create a simple HTTP server to test the connection
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Hello World!');
  res.end();
}).listen(3000);

console.log('Server running at http://localhost:3000/');
