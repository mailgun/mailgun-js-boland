# mailgun.js

Simple Node.js module for [Mailgun](http://www.mailgun.com).

## Installation

`npm install mailgun-js`

## Usage overview

Please see [Mailgun Documentation](http://documentation.mailgun.net) for full Mailgun API reference. Depends on [request module](https://github.com/mikeal/request).
Most methods take a `data` parameter, which is a Javascript object that would contain the arguments for the Mailgun API.
All methods take a final parameter callback with three parameters: `error`, `response`, and `body`, exactly like the [request](https://github.com/mikeal/request) callback.
We try to parse the `body` into a javascript object, and return it to the callback as such for easier use and inspection by the client.
`response.statusCode` will be `200` if everything worked OK. See Mailgun documentation for other (error) response codes.
If there was an error a new `Error` object will be passed to the callback in the `error` parameter.

Currently we only implement the `send message` (non-MIME) API and the `Mailboxes`, `Routes`, and `Mailing Lists` API's. These would be the most common
and practical API's to be programmatically used. Others would be easy to add if needed.

```javascript
var api_key = 'key-XXXXXXXXXXXXXXXXXXXXXXX';
var domain = 'mydomain.mailgun.org';
var mailgun = require('mailgun-js')(api_key, domain);

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};

mailgun.messages.send(data, function (error, response, body) {
  console.log(body);
});
```

## API

All methods take a callback as their last parameter. The callback is called with a Javascript `Error` (if any) and then the `response` and the `body` returned by mailgun. 
For actual examples see the tests source code. Note that `routes` and `lists` API's do not act on specified mailgun domains and are global for the mailgun account.

* `mailgun.messages` - Creates a new email message and sends it using mailgun.
   * `.send(data)` - [send a message](http://documentation.mailgun.net/api-sending.html).
* `mailgun.mailboxes` - create, update, delete and list [mailboxes](http://documentation.mailgun.net/api-mailboxes.html).
   * `.list(data)` - list mailboxes. `data` is optional and can contain `limit` and `skip`.
   * `.create(data)` - create a mailbox. `data` should have `mailbox` name and `password`.
   * `.update(data)` - update a mailbox given the `mailbox` name. Currently only the `password` can be changed.
   * `.del(mailbox)` - delete a mailbox given the `mailbox` name.
* `mailgun.routes` - create, get, update, delete and list [routes](http://documentation.mailgun.net/api-routes.html).
   * `.list(data)` - list routes. `data` is optional and can contain `limit` and `skip`.
   * `.get(id)` - get a specific route given the route `id`.
   * `.create(data)` - create a route. `data` should contain `priority`, `description`, `expression` and `action` as strings.
   * `.update(id, data)` - update a route given route `id`. All `data` parameters optional. This API call only updates the specified fields leaving others unchanged.
   * `.del(id)` - delete a route given route `id`.
* `mailgun.lists` - create, get, update, delete and list [mailing lists](http://documentation.mailgun.net/api-mailinglists.html) and get mailing list stats.
   * `.list(data)` - list mailing lists. `data` is optional and can contain `address`, `limit` and `skip`.
   * `.get(address)` - get a specific mailing list given mailing list `address`.
   * `.create(data)` - create a mailing list. `data` should contain `address`, `name`, `description`, and `access_level` as strings.
   * `.update(address, data)` - update a mailing list given mailing list `address`.
   * `.del(address)` - delete a mailing list given mailing list `address`.
   * `.stats(address)` - fetches mailing list stats given mailing list `address`.
* `mailgun.lists.members` - create, get, update, delete and list [mailing list members](http://documentation.mailgun.net/api-mailinglists.html).
   * `.list(listAddress, data)` - list mailing list members. `data` is optional and can contain `subscribed`, `limit` and `skip`.
   * `.get(listAddress, memberAddress)` - get a specific mailing list member given mailing list address and member address.
   * `.create(listAddress, data)` - create a mailing list member. `data` should contain `address`, optional member `name`, `subscribed`, `upsert`, and any additional `vars`.
   * `.update(listAddress, memberAddress, data)` - update a mailing list member with given properties. Won't touch the property if it's not passed in.
   * `.del(listAddress, memberAddress)` - delete a mailing list member given mailing list address and member address.
* `mailgun._get(resource,data,callback)` - sends GET request to the specified resource on api.
* `mailgun._post(resource,data,callback)` - sends POST request to the specified resource on api.
* `mailgun._del(resource,data,callback)` - sends DELETE request to the specified resource on api.
* `mailgun._put(resource,data,callback)` - sends PUT request to the specified resource on api.

### Unexposed API Methods

Mailgun-js also provides helper methods to allow users to interact with parts of the api that are not exposed already.

Example: Get All Stats

```js
  
mailgun._get('/stats', function (error, response, body) {
  console.log(body);
});

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

The tests will call Mailgun API, and will send a test email, create mailbox(es), route(s), mailing list and mailing list member.

## TODO

* Other API sections.

## License

This project is not endorsed by or affiliated with [Mailgun](http://www.mailgun.com).

Copyright 2012, 2013 OneLobby

Licensed under the MIT License.
