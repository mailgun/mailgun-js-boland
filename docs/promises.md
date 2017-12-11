## Promises <a id="promises"></a>

Module works with Node-style callbacks, but also implements (native) Promise based API. When a callback is not passed into to a function a Promise is returned that is resolved or rejected when the action succeeds to fails.

```js
mailgun.lists('mylist@mydomain.com').info().then(function (data) {
  console.log(data)
}, function (err) {
  console.log(err)
})
```

With `async` / `await`:

```js
async function main () {
  const data = await mailgun.lists('mylist@mydomain.com').info()
  console.log(data)
}

main()
```
