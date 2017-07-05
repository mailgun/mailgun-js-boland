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

When sending using `sendMime()` we have to set the MIME header `X-Mailgun-Recipient-Variables` appropriately to the recipient variables data. For example using [mailcomposer](https://nodemailer.com/extras/mailcomposer/):

```js
const MailComposer = require('nodemailer/lib/mail-composer')
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain })

const toArray = ['recipient+test1@gmail.com', 'recipient+test2@gmail.com']

const recipientVars = {
  'recipient+test1@gmail.com': {
    first: 'Recv1',
    id: 1
  },
  'recipient+test2@gmail.com': {
    first: 'Recv2',
    id: 2
  }
}

const mailOptions = {
  from: 'test+sender@gmail.com',
  to: toArray,
  subject: 'Hey, %recipient.first%',
  text: 'Hello %recipient.id%',
  html: 'Hello <b>%recipient.id%</b>',
  headers: {
    'X-Mailgun-Recipient-Variables': JSON.stringify(recipientVars)
  }
}

const mail = new MailComposer(mailOptions)
mail.compile().build(function (err, message) {
  const data = {
    to: toArray,
    message: message.toString('ascii'),
    'recipient-variables': recipientVars
  }

  mailgun.messages().sendMime(data, function (err, body) {
    console.log(body)
  })
})
``` 
