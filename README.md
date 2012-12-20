# mailgun.js

Simple Node.js module for [Mailgun](http://www.mailgun.com).

## Installation

`npm install mailgun-js`

## Usage overview

Please see [Mailgun Documentation](http://documentation.mailgun.net) for full Mailgun API reference. Depends on [request module](https://github.com/mikeal/request).
Most methods take a `data` parameter, which is a Javascript object that would contain the arguments for the Mailgun API.
All methods take a final parameter callback with three parameters: `error`, `response`, and `body`, exactly like the request callback.
We try to parse the `body` into a javascript object, and return it to the callback as such for easier use and inspection by the client.
`response.statusCode` will be `200` if everything worked OK. See Mailgun documentation for other (error) response codes.
If there was an error a new `Error` object will be passed to the callback in the `error` parameter.

Currently we only implement the `send message` (non-MIME) API and the `Mailboxes` and `Routes` API's. These would be the most common
and practical API's to be programmatically used. Others would be easy to add if needed.

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

### mailgun.sendMessage(data, callback)

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
{
  message: 'Queued. Thank you.',
  id: '<20121217142109.14542.78348@mydomain.com>'
}
```

### mailgun.getMailboxes(callback)

Gets a list of mailboxes for the domain. Sample `body`:

```
{
  total_count: 4,
  items:
   [
     { size_bytes: 167936,
       created_at: 'Thu, 13 Sep 2012 17:41:58 GMT',
       mailbox: 'mailbox1@mydomain.com' },
     { size_bytes: 225280,
       created_at: 'Sat, 13 Oct 2012 17:52:28 GMT',
       mailbox: 'mailbox2@mydomain.com' },
     { size_bytes: null,
       created_at: 'Wed, 12 Dec 2012 19:39:32 GMT',
       mailbox: 'mailbox3@mydomain.com' },
     { size_bytes: 0,
       created_at: 'Wed, 12 Dec 2012 21:19:57 GMT',
       mailbox: 'mailbox4@mydomain.com' }
   ]
}
```

### mailgun.createMailbox(data, callback)

Creates a new mailbox for the domain.

```javascript
var data = {
  mailbox: 'testmailbox1',
  password: 'password1'
};

mailgun.createMailbox(data, function (error, response, body) {
  console.log(body);
});
```

Sample `body`:

```
{
  message: 'Created 1 mailboxes'
}
```

### mailgun.deleteMailbox(mailbox, callback)

Deletes the specified mailbox for the domain.

```javascript
mailgun.deleteMailbox('testmailbox1', function (error, response, body) {
  console.log(body);
});
```

Sample `body`:

```
{
  message: 'Mailbox has been deleted',
  spec: 'testmailbox1@mydomain.com'
}
```

### mailgun.updateMailbox(data, callback)

Updates the password for a specified mailbox in the the domain.

```javascript
var data = {
  mailbox: 'testmailbox1',
  password: 'newpassword2'
};

mailgun.updateMailbox(data, function (error, response, body) {
  console.log(body);
});
```

Sample `body`:

```
{
  message: 'Password changed'
}
```

### mailgun.getRoutes(callback)

Gets all the routes. Note that all `Routes` API methods are not domain-specific. Sample `body`:

```
{ total_count: 1,
  items:
   [
     {
       description: 'my route',
       created_at: 'Fri, 14 Dec 2012 20:46:14 GMT',
       actions: [ 'forward("http://mydomain.com/mail/receive")' ],
       priority: 0,
       expression: 'match_recipient("^[A-Z0-9._%+-]+@mydomain.com")',
       id: '28cb12345cbd98765e123b84'
     }
   ]
}
```

### mailgun.getRoute(id, callback)

Returns a single route object based on its ID.

```javascript
mailgun.getRoute('12cf345d09876d23450211ed', function (error, response, body) {
  console.log(body);
});
```

Sample `body`:

```
{
  route:
   {
     description: 'my new route!',
     created_at: 'Mon, 17 Dec 2012 15:21:33 GMT',
     actions: [ 'forward("http://mydomain.com/mail/receive")' ],
     priority: 0,
     expression: 'match_recipient("^[A-Z0-9._%+-]+@mydomain.com")',
     id: '12cf345d09876d23450211ed'
   }
}
```

### mailgun.createRoute(data, callback)

Creates a new route.

```javascript
var data = {
  description: 'my new route!',
  action: [ 'forward("http://mydomain.com/mail/receive")', 'stop()' ],
  expression: 'match_recipient("^[A-Z0-9._%+-]+@mydomain.com")'
};

mailgun.createRoute(data, function (error, response, body) {
  console.log(body);
});
```

Sample `body`:

```
{
  message: 'Route has been created',
  route:
   {
     description: 'my new route!',
     created_at: 'Mon, 17 Dec 2012 15:21:33 GMT',
     actions: 
       [ 'forward("http://mydomain.com/mail/receive")',
         'stop()' ],
     priority: 0,
     expression: 'match_recipient("^[A-Z0-9._%+-]+@mydomain.com")',
     id: '12cf345d09876d23450211ed'
   }
}
```

### mailgun.updateRoute(id, data, callback)

Updates a given route by ID. All data parameters optional.
This API call only updates the specified fields leaving others unchanged.

```javascript
var data = {
  description: 'my new updated route!',
  action: 'forward("http://mydomain.com/receiveMail")'
};

mailgun.updateRoute('12cf345d09876d23450211ed', data, function (error, response, body) {
  console.log(body);
});
```

Sample `body`:

```
{
  priority: 0,
  description: 'my new updated route!',
  created_at: 'Mon, 17 Dec 2012 15:21:33 GMT',
  expression: 'match_recipient("^[A-Z0-9._%+-]+@mydomain.com")',
  message: 'Route has been updated',
  actions: [ 'forward("http://mydomain.com/receiveMail")' ],
  id: '12cf345d09876d23450211ed'
}
```

### mailgun.deleteRoute(id, callback)

Deletes the specified route

```javascript
mailgun.deleteRoute('12cf345d09876d23450211ed', function (error, response, body) {
  console.log(body);
});
```

Sample `body`:

```
{
  message: 'Route has been deleted',
  id: '12cf345d09876d23450211ed'
}
```

## Tests

To run the test suite you must first have a Mailgun account with a domain setup. Then create a file named _./test/auth.json_, which contains your credentials as JSON, for example:

```json
{ "api_key": "key-XXXXXXXXXXXXXXXXXXXXXXX", "domain": "mydomain.mailgun.org" }
```

You should edit _./test/fixture.json_ and modify at least the `to` and `from` fields of the `message` object to match
emails you would like to test with. Modify other fields as desired, though the given defaults will work.

Then install the dev dependencies and execute the test suite:

```
$ npm install
$ npm test
```

The tests will call Mailgun API, and will send a test email, create mailbox(es) and route(s).

## TODO

* Other API sections.

## License

This project is not endorsed by or affiliated with [Mailgun](http://www.mailgun.com).

Copyright 2012 OneLobby

Licensed under the MIT License.
