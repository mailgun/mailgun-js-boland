## Promises <a id="promises"></a>

Module works with Node-style callbacks, but also implements promises with the [Q](http://github.com/kriskowal/q) library.

```js
mailgun.lists('mylist@mydomain.com').info().then(function (data) {
  console.log(data);
}, function (err) {
  console.log(err);
});
```

The function passed as 2nd argument is optional and not needed if you don't care about the fail case.
