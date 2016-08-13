# mailgun.js

Simple Node.js module for [Mailgun](http://www.mailgun.com).

[![NPM](https://nodei.co/npm/mailgun-js.png?downloads=true&stars=true)](https://nodei.co/npm/mailgun-js/)

[![NPM](https://nodei.co/npm-dl/mailgun-js.png)](https://nodei.co/npm/mailgun-js/)

## Installation <a id="install"></a>

`npm install mailgun-js`

## Usage overview <a id="overview"></a>

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
var api_key = 'key-XXXXXXXXXXXXXXXXXXXXXXX';
var domain = 'mydomain.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

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

#### Options <a id="options"></a>

`Mailgun` object constructor options:

* `apiKey` - Your Mailgun API KEY
* `domain` - Your Mailgun Domain
* `mute` - Set to `true` if you wish to mute the console error logs in `validateWebhook()` function
* `proxy` - The proxy URI in format `http[s]://[auth@]host:port`. ex: `'http://proxy.example.com:8080'`
* `timeout` - Request timeout in milliseconds
* `host` - the mailgun host (default: 'api.mailgun.net')
* `protocol` - the mailgun protocol (default: 'https:', possible values: 'http:' or 'https:')
* `port` - the mailgun port (default: '443')
* `endpoint` - the mailgun host (default: '/v3')
* `retry` - the number of **total attempts** to do when performing requests. Default is `1`.
That is, we will try an operation only once with no retries on error.

#### Creating mailing list members <a id="members"></a>

`members().create({data})` will create a mailing list member with `data`. Mailgun also offers a resource for creating
members in bulk. Doing a `POST` to `/lists/<address>/members.json` adds multiple members, up to 1,000 per call,
to a Mailing List. This can be accomplished using `members().add()`.

```js
var members = [
  {
    address: 'Alice <alice@example.com>',
    vars: { age: 26 }
  },
  {
    name: 'Bob',
    address: 'bob@example.com',
    vars: { age: 34 }
  }
];

mailgun.lists('mylist@mycompany.com').members().add({ members: members, subscribed: true }, function (err, body) {
  console.log(body);
});
```

#### Batch sending & recipient variables <a id="batch"></a>

Example code to perform [batch sending](https://documentation.mailgun.com/user_manual.html#batch-sending) with
recipient variables:

```js
recipientVars = {
  'bob@companyx.com': {
    first: 'Bob',
    id: 1
  },
  'alice@companyy.com': {
    first: 'Alice',
    id: 2
  }
};

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: ['bob@companyx.com', 'alice@companyy.com'],
  subject: 'Hey, %recipient.first%',
  'recipient-variables': recipientVars,
  text: 'If you wish to unsubscribe, click http://mailgun/unsubscribe/%recipient.id%',
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

## Notes

This project is not endorsed by or affiliated with [Mailgun](http://www.mailgun.com).
The general design and some code was heavily inspired by [node-heroku-client](https://github.com/jclem/node-heroku-client).

## License

Copyright 2012, 2013, 2014 OneLobby

Licensed under the MIT License.
