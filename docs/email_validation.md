## Email Addresses validation

These routes require Mailgun public API key.
Please check Mailgun [email validation documentation](https://documentation.mailgun.com/api-email-validation.html) for more responses details.

### Validate one Email Address

Checks if email is valid.

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
