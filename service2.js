const express = require('express');
const redis = require('redis');
const app = express();
const client = redis.createClient();
const port = 3002;

client.on('message', (channel, message) => {
  // messages coming from service 1 cluster publish via pub sub
  console.log(`${channel}: ${message}`);
});
client.subscribe('myPubSubChannel');

app.get('/service2/set', (req, res) => {
  client.set('myOtherValue', req.query.value || 'backup', (err, value) => {
    res.send('Your value has been set');
  });
});

app.get('/service2/get', (req, res) => {
  client.get('myOtherValue', (err, value) => {
    res.send(`The current value is ${value}`);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
