# mailgun.js

Simple Node.js module for [Mailgun](http://www.mailgun.com).

## Installation

`npm install mailgun-js`

## Usage overview

Please see [Mailgun Documentation](http://documentation.mailgun.net) for full Mailgun API reference.
All methods take a final parameter callback with three parameters: `error`, `response`, and `body`, exactly like the request callback.
We try to parse the `body` into a javascript object, and return it to the callback as such for easier use and inspection by the client.
`response.statusCode` will be `200` if everything worked OK. See Mailgun documentation for other (error) response codes.

```javascript
var Mailgun = require('mailgun-js');

var mailgun = new Mailgun('key-...............................', 'mydomain.com');

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};

mailgun.sendMessage(data, function (error, response, body) {
  console.log(body);
});
```

## Constructor

### new Mailgun(key, domain);

Returns a Mailgun object with your Mailgun API key and Mailgun domain set on the object.

## Methods



### mailgun.sendMessage(data, callback);

```javascript
var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};

mailgun.sendMessage(data, function (error, response, body) {
  console.log(body);
});
```

Sample `body` is a javascript object

```
{ message: 'Queued. Thank you.',
  id: '<20121217142109.14542.78348@onelobby.mailgun.org>' }
```

## License

This project is not endorsed by or affiliated with [Mailgun](http://www.mailgun.com).

Copyright 2012 Bojan Djurkovic

Licensed under the MIT License.
