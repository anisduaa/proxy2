const http = require('http');
const httpProxy = require('http-proxy');
const server1 = 'http://localhost:3001';
const server2 = 'http://localhost:3002';

const targets = [server1, server2];

let currentTarget = 0;

const proxy = httpProxy.createProxyServer();

const server = http.createServer((req, res) => {
  const target = targets[currentTarget];
  currentTarget = (currentTarget + 1) % targets.length;

  proxy.web(req, res, { target });
});

proxy.on('error', (err, req, res) => {
  console.error(err);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Something went wrong. Please try again later.');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Load balancer listening on port ${PORT}`);
});
