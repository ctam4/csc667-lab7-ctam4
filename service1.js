const express = require('express');
const redis = require('redis');
const app = express();
const client = redis.createClient();
const port = 3001;

let counter = 0; // instance variable, bad, don't do this

app.get('/service1/*', (req, res) => {
  // counter++;
  // Alert others when this endpoint has been triggered
  client.publish('myPubSubChannel', `${process.env.NODE_APP_INSTANCE} has been visited.`);
  client.incr('myCounter', (err, updatedValue) => {
    // redis takes care of sync and returns new value
    if (err) console.log(err); // only if broken
    // this is after redis responds
    console.log('Hitting service', process.env.NODE_APP_INSTANCE); // which clone is it?
    res.send(`Hello from instance: ${process.env.NODE_APP_INSTANCE}, ${updatedValue} Visits!!!`);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
