## Tests <a id="tests"></a>

To run the test suite you must first have a Mailgun account with a domain setup. Then create a file named _./test/data/auth.json_, which contains your credentials as JSON, for example:

```json
{ "api_key": "XXXXXXXXXXXXXXXXXXXXXXX", "public_api_key": "XXXXXXXXXXXXXXXXXXXXXXX", "domain": "mydomain.mailgun.org" }
```

You should edit _./test/data/fixture.json_ and modify the data to match your context.

Then install the dev dependencies and execute the test suite:

```
$ npm install
$ npm test
```

The tests will call Mailgun API, and will send a test email, create route(s), mailing list and mailing list member.
