# mailgun.js

Simple Node.js module for [Mailgun](http://www.mailgun.com).

## Installation

`npm install mailgun-js`

## Usage overview

Please see [Mailgun Documentation](http://documentation.mailgun.net) for full Mailgun API reference.

Currently we implement the `send message` (non-MIME) API and the `Domains`, `Routes`, `Campaigns`, `Mailing Lists`, `Unsubscribes`, `Stats`, and `Bounces` API's. These would be the most common
and practical API's to be programmatically used. Others would be easy to add if needed.

This module works by providing proxy objects for interacting with different resources through the Mailgun API.
Most methods take a `data` parameter, which is a Javascript object that would contain the arguments for the Mailgun API.
All methods take a final parameter callback with two parameters: `error`, and `body`.
We try to parse the `body` into a javascript object, and return it to the callback as such for easier use and inspection by the client.
If there was an error a new `Error` object will be passed to the callback in the `error` parameter.
See the `/docs` folder for detailed documentation. For full usage examples see the `/test` folder.

```js
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

#### Attachments

Attachments can be sent using either the `attachment` or `inline` parameters. `inline` parameter can be use to send an
attachment with `inline` disposition. It can be used to send inline images. Both types are supported with same mechanisms
as described, we will just use `attachment` parameter in the documentation below but same stands for `inline`.

Sending attachments can be done in a few ways. We can use the path to a file in the `attachment` parameter.
If the `attachment` parameter is of type `string` it is assumed to be the path to a file.

```js
var filepath = path.join(__dirname, 'mailgun_logo.png');

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!',
  attachment: filepath
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

We can pass a buffer (has to be a `Buffer` object) of the data. If a buffer is used the data will be attached using a
generic filename "file".

```js
var filepath = path.join(__dirname, 'mailgun_logo.png');
var file = fs.readFileSync(filepath);

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

Finally we provide a `Mailgun.Attachment` class to add attachments with a bit more customization. The Attachment
constructor takes an `options` object. The `options` parameters can have the following fields:
* `data` - can be one of
    * a string representing file path to the attachment
    * a buffer of file data
    * an instance of `Readable` which means it is a readable stream.
* `filename` - the file name to be used for the attachment. Default is 'file'
* `contentType` - the content type. Required for case of `Readable` data. Ex. `image/jpg`.
* `knownLength` - the content length in bytes. Required for case of `Readable` data.

If an attachment object does not satisfy those valid conditions it is ignored. Multiple attachments can be sent by
passing an array in the `attachment` parameter. The array elements can be of any one of the valid types and each one
will be handled appropriately.

```js
var filename = 'mailgun_logo.png';
var filepath = path.join(__dirname, filename);
var file = fs.readFileSync(filepath);

var attch = new Mailgun.Attachment({data: file, filename: filename});

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!',
  attachment: attch
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

```js
var filename = 'mailgun_logo.png';
var filepath = path.join(__dirname, filename);
var fileStream = fs.createReadStream(filepath);
var fileStat = fs.statSync(filepath);

msg.attachment = new Mailgun.Attachment({
  data: fileStream,
  filename: 'my_custom_name.png',
  knownLength: fileStat.size,
  contentType: 'image/png'});

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

#### Creating mailing list members

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

## Generic requests

Mailgun-js also provides helper methods to allow users to interact with parts of the api that are not exposed already.
These are not tied to the domain passed in the constructor, and thus require the full path with the domain
passed in the `resource` argument.

* `mailgun.get(resource, data, callback)` - sends GET request to the specified resource on api.
* `mailgun.post(resource, data, callback)` - sends POST request to the specified resource on api.
* `mailgun.delete(resource, data, callback)` - sends DELETE request to the specified resource on api.
* `mailgun.put(resource, data, callback)` - sends PUT request to the specified resource on api.

Example: Get some stats

```js
mailgun.get('/samples.mailgun.org/stats', { event: ['sent', 'delivered'] }, function (error, body) {
  console.log(body);
});
```

## Promises

Module works with Node-style callbacks, but also implements promises with the [Q](http://github.com/kriskowal/q) library.

```js
mailgun.lists('mylist@mydomain.com').info().then(function (data) {
  console.log(data);
}, function (err) {
  console.log(err);
});
```

The function passed as 2nd argument is optional and not needed if you don't care about the fail case.

## Webhook validation

The Mailgun object also has a helper function for validating Mailgun Webhook requests
(as per the [mailgun docs for securing webhooks](http://documentation.mailgun.com/user_manual.html#securing-webhooks)).
This code came from [this gist](https://gist.github.com/coolaj86/81a3b61353d2f0a2552c).

Example usage:

```js
var Mailgun = require('mailgun-js');
var mailgun = new Mailgun({apiKey: api_key, domain: domain});

function router(app) {
  app.post('/webhooks/mailgun/*', function (req, res, next) {
    var body = req.body;

    if (!mailgun.validateWebhook(body.timestamp, body.token, body.signature)) {
      console.error('Request came, but not from Mailgun');
      res.send({ error: { message: 'Invalid signature. Are you even Mailgun?' } });
      return;
    }

    next();
  });

  app.post('/webhooks/mailgun/catchall', function (req, res) {
    // actually handle request here
  });
}
```

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
The general design and some code was heavily inspired by [node-heroku-client](https://github.com/jclem/node-heroku-client).

## License

Copyright 2012, 2013, 2014 OneLobby

Licensed under the MIT License.
