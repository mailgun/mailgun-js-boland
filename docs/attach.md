### Attachments

Attachments can be sent using either the `attachment` or `inline` parameters. `inline` parameter can be use to send an
attachment with `inline` disposition. It can be used to send inline images. Both types are supported with same mechanisms
as described, we will just use `attachment` parameter in the documentation below but same stands for `inline`.

Sending attachments can be done in a few ways. We can use the path to a file in the `attachment` parameter.
If the `attachment` parameter is of type `string` it is assumed to be the path to a file.

```js
var filepath = path.join(__dirname, 'mailgun_logo.png');

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!',
  attachment: filepath
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

We can pass a buffer (has to be a `Buffer` object) of the data. If a buffer is used the data will be attached using a
generic filename "file".

```js
var filepath = path.join(__dirname, 'mailgun_logo.png');
var file = fs.readFileSync(filepath);

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!',
  attachment: file
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

We can also pass in a stream of the data. This is useful if you're attaching a file from the internet.

```js
var request = require('request');
var file = request("https://www.google.ca/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png");

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!',
  attachment: file
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

Finally we provide a `Mailgun.Attachment` class to add attachments with a bit more customization. The Attachment
constructor takes an `options` object. The `options` parameters can have the following fields:
* `data` - can be one of
    * a string representing file path to the attachment
    * a buffer of file data
    * an instance of `Stream` which means it is a readable stream.
* `filename` - the file name to be used for the attachment. Default is 'file'
* `contentType` - the content type. Required for case of `Stream` data. Ex. `image/jpeg`.
* `knownLength` - the content length in bytes. Required for case of `Stream` data.

If an attachment object does not satisfy those valid conditions it is ignored. Multiple attachments can be sent by
passing an array in the `attachment` parameter. The array elements can be of any one of the valid types and each one
will be handled appropriately.

```js
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var filename = 'mailgun_logo.png';
var filepath = path.join(__dirname, filename);
var file = fs.readFileSync(filepath);

var attch = new mailgun.Attachment({data: file, filename: filename});

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!',
  attachment: attch
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

```js
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var filename = 'mailgun_logo.png';
var filepath = path.join(__dirname, filename);
var fileStream = fs.createReadStream(filepath);
var fileStat = fs.statSync(filepath);

msg.attachment = new mailgun.Attachment({
  data: fileStream,
  filename: 'my_custom_name.png',
  knownLength: fileStat.size,
  contentType: 'image/png'});

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

#### Sending MIME messages <a id="mime"></a>

Sending messages in MIME format can be accomplished using the `sendMime()` function of the `messages()` proxy object.
The `data` parameter for the function has to have `to` and `message` properties. The `message` property can be a full
file path to the MIME file, a stream of the file (that is a `Stream` object), or a string representation of the MIME
message. To build a MIME string you can use the [nodemailer](https://www.npmjs.org/package/nodemailer) library.
Some examples:

```js
var domain = 'www.mydomain.com';
var mailgun = require('mailgun-js')({ apiKey: "YOUR API KEY", domain: domain });
var MailComposer = require('nodemailer/lib/mail-composer');

var mailOptions = {
  from: 'you@samples.mailgun.org',
  to: 'mm@samples.mailgun.org',
  subject: 'Test email subject',
  text: 'Test email text'
};

var mail = new MailComposer(mailOptions);

mail.compile().build((err, message) => {
  var dataToSend = {
    to: 'mm@samples.mailgun.org',
    message: message.toString('ascii')
  };

  mailgun.messages().sendMime(dataToSend, (err, body) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(body);
  });
});
```
#### Referencing MIME file

```js
var filepath = '/path/to/message.mime';

var data = {
  to: fixture.message.to,
  message: filepath
};

mailgun.messages().sendMime(data, function (err, body) {
  console.log(body);
});
```

```js
var filepath = '/path/to/message.mime';

var data = {
  to: fixture.message.to,
  message: fs.createReadStream(filepath)
};

mailgun.messages().sendMime(data, function (err, body) {
  console.log(body);
});
```
