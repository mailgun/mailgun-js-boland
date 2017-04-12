## Batch Sending

Mailgun-js can be used for batch sending. Please see Mailgun [documentation](https://documentation.mailgun.com/user_manual.html#batch-sending) for more details.
Example source code:

```js
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var recipientVars = {
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
  from: 'Excited User <me@acme.com>',
  to: ['bob@companyx.com', 'alice@companyy.com'],
  subject: 'Hey, %recipient.first%',
  'recipient-variables': recipientVars,
  text: 'If you wish to unsubscribe, click http://mailgun/unsubscribe/%recipient.id%',
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```
