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
{
  message: 'Queued. Thank you.',
  id: '<20121217142109.14542.78348@onelobby.mailgun.org>'
}
```

### mailgun.getMailboxes(callback);

Gets a list of mailboxes for the domain. Sample `body`:

```
{ total_count: 4,
  items:
   [ { size_bytes: 167936,
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

### mailgun.createMailbox(data, callback);

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

Sample `body` is a javascript object

```
{
  message: 'Created 1 mailboxes'
}
```

### mailgun.deleteMailbox(mailbox, callback);

Deletes the specified mailbox for the domain.

```javascript
mailgun.deleteMailbox('testmailbox1', function (error, response, body) {
  console.log(body);
});
```

Sample `body` is a javascript object

```
{
  message: 'Mailbox has been deleted',
  spec: 'testmailbox1@mydomain.com'
}
```

### mailgun.updateMailbox(data, callback);

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

Sample `body` is a javascript object

```
{
  message: 'Password changed'
}
```

## License

This project is not endorsed by or affiliated with [Mailgun](http://www.mailgun.com).

Copyright 2012 OneLobby

Licensed under the MIT License.
