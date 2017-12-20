## Email Addresses validation

Please check Mailgun [email validation documentation](https://documentation.mailgun.com/api-email-validation.html) for more responses details.

### Validate Email Address

**mailgun.validate(address, private, options, fn)**

Checks if email is valid.

- `private` - wether it's private validate
- `options` - any additional options

Example usage:

```js
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

mailgun.validate('test@mail.com', function (err, body) {
  if (body && body.is_valid) {
    // do something
  }
});
```

### Parse Email Addresses list

**mailgun.parse(address, private, options, fn)**

- `private` - wether it's private validate
- `options` - any additional options

Parses list of email addresses and returns two lists: 
  - parsed email addresses
  - unparseable email addresses

Example usage:

```js
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

mailgun.parse([ 'test@mail.com', 'test2@mail.com' ], function (err, body) {
  if (error) {
    // handle error
  } else {
    // do something with parsed addresses: body.parsed;
    // do something with unparseable addresses: body.unparseable;
  }
});
```
