## Generic requests <a id="generic"></a>

Mailgun-js also provides helper methods to allow users to interact with parts of the api that are not exposed already.
These are not tied to the domain passed in the constructor, and thus require the full path with the domain
passed in the `resource` argument.

* `mailgun.get(resource, data, callback)` - sends GET request to the specified resource on api.
* `mailgun.post(resource, data, callback)` - sends POST request to the specified resource on api.
* `mailgun.delete(resource, data, callback)` - sends DELETE request to the specified resource on api.
* `mailgun.put(resource, data, callback)` - sends PUT request to the specified resource on api.

Example: Get some stats

```js
mailgun.get('/samples.mailgun.org/stats', { event: ['sent', 'delivered'] }, function (error, body) {
  console.log(body);
});
```
