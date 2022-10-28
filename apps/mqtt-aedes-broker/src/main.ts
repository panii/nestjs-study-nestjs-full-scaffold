// nx run mqtt-aedes-broker:build
// node dist/apps/mqtt-aedes-broker/main.js
import * as aedes from 'aedes';
import * as net from 'net';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const aedesServer = aedes();

const server = net.createServer(aedesServer.handle);
const mqttPort = 1882;
server.listen(mqttPort, () => {
  console.log('Aedes MQTT broker started and listening on port ', mqttPort);
});
