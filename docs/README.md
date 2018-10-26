# mailgun.js

Simple Node.js module for [Mailgun](http://www.mailgun.com).

[![npm version](https://img.shields.io/npm/v/mailgun-js.svg?style=flat-square)](https://www.npmjs.com/package/mailgun-js)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
[![License](https://img.shields.io/github/license/bojand/mailgun-js.svg?style=flat-square)](https://raw.githubusercontent.com/bojand/mailgun-js/master/LICENSE.txt)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg?style=flat-square)](https://www.paypal.me/bojandj)
[![Buy me a coffee](https://img.shields.io/badge/buy%20me-a%20coffee-orange.svg?style=flat-square)](https://www.buymeacoffee.com/bojand)

## Installation

`npm install mailgun-js`

## Usage overview

This is a simple Node.js module for interacting with the [Mailgun](http://www.mailgun.com) API. This module is intended to be used within Node.js environment and **not** from the browser. For browser use the [mailgun.js](https://github.com/mailgun/mailgun-js) module.

Please see [Mailgun Documentation](https://documentation.mailgun.com) for full Mailgun API reference.

This module works by providing proxy objects for interacting with different resources through the Mailgun API.
Most methods take a `data` parameter, which is a Javascript object that would contain the arguments for the Mailgun API.
All methods take a final parameter callback with two parameters: `error`, and `body`.
We try to parse the `body` into a javascript object, and return it to the callback as such for easier use and inspection by the client.
If there was an error a new `Error` object will be passed to the callback in the `error` parameter.
If the error originated from the (Mailgun) server, the response code will be available in the `statusCode` property
of the `error` object passed in the callback.
See the `/docs` folder for detailed documentation. For full usage examples see the `/test` folder.

```js
var api_key = 'XXXXXXXXXXXXXXXXXXXXXXX';
var domain = 'www.mydomain.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!'
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

Note that the `to` field is required and should contain all recipients ("TO", "CC" and "BCC") of the message (see https://documentation.mailgun.com/api-sending.html#sending). Additionally `cc` and `bcc` fields can be specified. Recipients in those fields will be addressed as such.

Messages stored using the Mailgun `store()` action can be retrieved using `messages(<message_key>).info()` function.
Optionally the MIME representation of the message can be retrieved if `MIME` argument is passed in and set to `true`.

Something more elaborate. Get mailing list info, create a member and get mailing list members and update member.
Notice that the proxy objects can be reused.

```js
var list = mailgun.lists('mylist@mycompany.com');

list.info(function (err, data) {
  // `data` is mailing list info
  console.log(data);
});

var bob = {
  subscribed: true,
  address: 'bob@gmail.com',
  name: 'Bob Bar',
  vars: {age: 26}
};

list.members().create(bob, function (err, data) {
  // `data` is the member details
  console.log(data);
});

list.members().list(function (err, members) {
  // `members` is the list of members
  console.log(members);
});

list.members('bob@gmail.com').update({ name: 'Foo Bar' }, function (err, body) {
  console.log(body);
});
```

#### Options

`Mailgun` object constructor options:

* `apiKey` - Your Mailgun API KEY
* `publicApiKey` - Your public Mailgun API KEY
* `domain` - Your Mailgun Domain (Please note: domain field is `MY-DOMAIN-NAME.com`, not https://api.mailgun.net/v3/MY-DOMAIN-NAME.com)
* `mute` - Set to `true` if you wish to mute the console error logs in `validateWebhook()` function
* `proxy` - The proxy URI in format `http[s]://[auth@]host:port`. ex: `'http://proxy.example.com:8080'`
* `timeout` - Request timeout in milliseconds
* `host` - the mailgun host (default: 'api.mailgun.net')
* `protocol` - the mailgun protocol (default: 'https:', possible values: 'http:' or 'https:')
* `port` - the mailgun port (default: '443')
* `endpoint` - the mailgun host (default: '/v3')
* `retry` - the number of **total attempts** to do when performing requests. Default is `1`.
That is, we will try an operation only once with no retries on error.

## Notes

This project is not endorsed by or affiliated with [Mailgun](http://www.mailgun.com).
The general design and some code was heavily inspired by [node-heroku-client](https://github.com/jclem/node-heroku-client).

## License

Copyright (c) 2012 - 2017 OneLobby and Bojan D.

Licensed under the MIT License.
