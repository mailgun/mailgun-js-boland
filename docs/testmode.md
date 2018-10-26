## Test mode

Test mode can be turned on using `testMode` option. When on, no requests are actually sent to Mailgun, rather we log the request options and applicable payload and form data. By default we log to `console.log`, unless `DEBUG` is turned on, in which case we use debug logging.

```js
mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain, testMode: true })

const data = {
  from: 'mailgunjs+test1@gmail.com',
  to: 'mailgunjstest+recv1@gmail.com',
  subject: 'Test email subject',
  text: 'Test email text'
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

```
options: { hostname: 'api.mailgun.net',
  port: 443,
  protocol: 'https:',
  path: '/v3/sandbox12345.mailgun.org/messages',
  method: 'POST',
  headers:
   { 'Content-Type': 'application/x-www-form-urlencoded',
     'Content-Length': 127 },
  auth: 'api:key-0e8pwgtt5ylx0m94xwuzqys2-o0x4-77',
  agent: false,
  timeout: undefined }
payload: 'to=mailgunjs%2Btest1%40gmail.com&from=mailgunjstest%2Brecv1%40gmail.com&subject=Test%20email%20subject&text=Test%20email%20text'
form: undefined
undefined
```

Note that in test mode no error or body are returned as a result.

The logging can be customized using `testModeLogger` option which is a function to perform custom logging.

```js
const logger = (httpOptions, payload, form) => {
  const { method, path } = httpOptions
  const hasPayload = !!payload
  const hasForm = !!form

  console.log(`%s %s payload: %s form: %s`, method, path, hasPayload, hasForm)
}

mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain, testMode: true, testModeLogger: logger })

const data = {
  from: 'mailgunjs+test1@gmail.com',
  to: 'mailgunjstest+recv1@gmail.com',
  subject: 'Test email subject',
  text: 'Test email text'
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

Sample output:

```
POST /v3/sandbox12345.mailgun.org/messages payload: true form: false
undefined
```
