## Webhook validation <a id="webhook"></a>

The Mailgun object also has a helper function for validating Mailgun Webhook requests
(as per the [mailgun docs for securing webhooks](http://documentation.mailgun.com/user_manual.html#securing-webhooks)).
This code came from [this gist](https://gist.github.com/coolaj86/81a3b61353d2f0a2552c).

Example usage:

```js
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

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
