# mailgun.js

Simple Node.js module for [Mailgun](http://www.mailgun.com).

## Installation

`npm install mailgun-js`

## Usage overview

Please see [Mailgun Documentation](http://documentation.mailgun.net) for full Mailgun API reference.

Currently we implement the `send message` (non-MIME) API and the `Domains`, `Routes`, `Mailing Lists`, `Unsubscribes` and `Bounces` API's. These would be the most common
and practical API's to be programmatically used. Others would be easy to add if needed.

This module works by providing proxy objects for interacting with different resources through the Mailgun API.
Most methods take a `data` parameter, which is a Javascript object that would contain the arguments for the Mailgun API.
All methods take a final parameter callback with two parameters: `error`, and `body`.
We try to parse the `body` into a javascript object, and return it to the callback as such for easier use and inspection by the client.
If there was an error a new `Error` object will be passed to the callback in the `error` parameter.
See the `/docs` folder for detailed documentation. For full usage examples see the `/test` folder.

```javascript
var api_key = 'key-XXXXXXXXXXXXXXXXXXXXXXX';
var domain = 'mydomain.mailgun.org';
var Mailgun = require('mailgun-js');

var mailgun = new Mailgun({apiKey: api_key, domain: domain});

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

Something more elaborate. Get mailing list info, create a member and get mailing list members and update member.
Notice that the proxy objects can be reused.

```
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

Sending attachments can be done either by passing the path as a `string` or
the `Buffer` containing the file data. If a buffer is used the data will be attached using a generic filename "file".
If `attachment` is a `string` it is assumed to be a path to a file. If attachment parameter is not of type `Buffer` or
a `string` it is ignored. Multiple attachments can be sent by passing an array in the `attachment` parameter.
The array elements can either Buffers or string and will be handled appropriately.

```
var filename = path.join(__dirname, '/mailgun_logo.png');

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!',
  attachment: filename
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

```
var filename = path.join(__dirname, '/mailgun_logo.png');
var file = fs.readFileSync(filename);

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!',
  attachment: file
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

## Generic requests

Mailgun-js also provides helper methods to allow users to interact with parts of the api that are not exposed already.

* `mailgun.get(resource, data, callback)` - sends GET request to the specified resource on api.
* `mailgun.post(resource, data, callback)` - sends POST request to the specified resource on api.
* `mailgun.delete(resource, data, callback)` - sends DELETE request to the specified resource on api.
* `mailgun.put(resource, data, callback)` - sends PUT request to the specified resource on api.

Example: Get some stats

```javascript
mailgun.get('/stats', { event: ['sent', 'delivered'] }, function (error, body) {
  console.log(body);
});
```

## Promises

Module works with Node-style callbacks, but also implements promises with the [Q](http://github.com/kriskowal/q) library.

```
mailgun.lists('mylist@mydomain.com').info().then(function (data) {
  console.log(data);
}, function (err) {
  console.log(err);
});
```

The function passed as 2nd argument is optional and not needed if you don't care about the fail case.

## Tests

To run the test suite you must first have a Mailgun account with a domain setup. Then create a file named _./test/auth.json_, which contains your credentials as JSON, for example:

```json
{ "api_key": "key-XXXXXXXXXXXXXXXXXXXXXXX", "domain": "mydomain.mailgun.org" }
```

You should edit _./test/fixture.json_ and modify the data to match your context.

Then install the dev dependencies and execute the test suite:

```
$ npm install
$ npm test
```

The tests will call Mailgun API, and will send a test email, create route(s), mailing list and mailing list member.

## Notes

This project is not endorsed by or affiliated with [Mailgun](http://www.mailgun.com).
The general design and some code was heavily influenced by [node-heroku-client](https://github.com/jclem/node-heroku-client).

## License

Copyright 2012, 2013, 2014 OneLobby

Licensed under the MIT License.
