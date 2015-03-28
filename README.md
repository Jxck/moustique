# moustique

## description

express like mqtt router

## example

```js
var Client = require('moustique')

var client = new Client('appname', 'username', 'wss://example.com/mqtt');

client.on('connect', function() {
  client.sub('/users/:userid/messages/:messageid/:option', function(message) {
    console.log(message.topic); // '/users/jxck/message/4321/ping'
    console.log(message.body); // { hello: 'world' }
    console.log(message.params); // { userid: 'jxck', messageid: 4321, option: 'ping' }
  });

  client.pub('/users/jxck/message/4321/ping', { hello: 'world' });
});
```

## license

The MIT License (MIT)
Copyright (c) 2013 Jxck

