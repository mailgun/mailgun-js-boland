const auth = require('./data/auth.json')
const fixture = require('./data/fixture.json')
const clone = require('clone')
const assert = require('assert')
const fs = require('fs')
const path = require('path')
const request = require('request')

const mailgun = require('../')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Messages', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test messages.send() invalid "from"', (done) => {
    mailgun.messages().send({
      'to': fixture.message.to
    }, (err) => {
      assert.ok(err)
      assert(/Missing parameter 'from'/.test(err.message))
      done()
    })
  })

  it('test messages().send()', (done) => {
    const msg = clone(fixture.message)

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with recipient vars', (done) => {
    const msg = clone(fixture.message_recipient_vars)

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with invalid attachment should go ok', (done) => {
    const msg = clone(fixture.message)

    msg.attachment = 123

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with attachment using filename', (done) => {
    const msg = clone(fixture.message)
    const filename = path.join(__dirname, '/data/mailgun_logo.png')

    msg.attachment = filename

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with attachment using filename with important flag', (done) => {
    const msg = clone(fixture.message)

    msg.important = true
    const filename = path.join(__dirname, '/data/mailgun_logo.png')

    msg.attachment = filename

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with attachment using filename and undefined v: var', (done) => {
    const msg = clone(fixture.message)
    const filename = path.join(__dirname, '/data/mailgun_logo.png')

    msg.attachment = filename

    msg['v:someFoo'] = undefined

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with attachment using file buffer', (done) => {
    const msg = clone(fixture.message)

    const filename = path.join(__dirname, '/data/mailgun_logo.png')
    const file = fs.readFileSync(filename)

    msg.attachment = file

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with attachment using Attachment object (Buffer)', (done) => {
    const msg = clone(fixture.message)

    const filename = '/data/mailgun_logo.png'
    const filepath = path.join(__dirname, filename)
    const file = fs.readFileSync(filepath)

    msg.attachment = new mailgun.Attachment({
      'data': file,
      filename
    })

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with attachment using Attachment object (file)', (done) => {
    const msg = clone(fixture.message)

    const filename = '/data/mailgun_logo.png'
    const filepath = path.join(__dirname, filename)

    msg.attachment = new mailgun.Attachment({
      'data': filepath,
      'filename': 'my_custom_name.png'
    })

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with multiple attachments', (done) => {
    const msg = clone(fixture.message)
    const filename = path.join(__dirname, '/data/fixture.json')
    const filename2 = path.join(__dirname, '/data/mailgun_logo.png')
    const file = fs.readFileSync(filename2)

    msg.attachment = [filename, file]

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with invalid inline attachment should go ok', (done) => {
    const msg = clone(fixture.message)

    msg.inline = 123

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with inline attachment using filename', (done) => {
    const msg = clone(fixture.message)
    const filename = path.join(__dirname, '/data/mailgun_logo.png')

    msg.inline = filename

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with inline attachment using file buffer', (done) => {
    const msg = clone(fixture.message)

    const filename = path.join(__dirname, '/data/mailgun_logo.png')
    const file = fs.readFileSync(filename)

    msg.inline = file

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with inline attachment using Attachment object (Buffer)', (done) => {
    const msg = clone(fixture.message)

    const filename = '/data/mailgun_logo.png'
    const filepath = path.join(__dirname, filename)
    const file = fs.readFileSync(filepath)

    msg.inline = new mailgun.Attachment({
      'data': file,
      filename
    })

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with inline attachment using Attachment object (file)', (done) => {
    const msg = clone(fixture.message)

    const filename = '/data/mailgun_logo.png'
    const filepath = path.join(__dirname, filename)

    msg.inline = new mailgun.Attachment({
      'data': filepath,
      'filename': 'my_custom_name.png'
    })

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with multiple inline attachments', (done) => {
    const msg = clone(fixture.message)
    const filename = path.join(__dirname, '/data/fixture.json')
    const filename2 = path.join(__dirname, '/data/mailgun_logo.png')
    const file = fs.readFileSync(filename2)

    msg.inline = [filename, file]

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with multiple inline and normal attachments', (done) => {
    const msg = clone(fixture.message)
    const filename = path.join(__dirname, '/data/fixture.json')
    const filename2 = path.join(__dirname, '/data/mailgun_logo.png')

    msg.attachment = filename
    msg.inline = filename2

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with multiple tags', (done) => {
    const msg = clone(fixture.message)

    msg['o:tag'] = ['tag1', 'tag2', 'tag3']

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with multiple tags and normal attachment', (done) => {
    const msg = clone(fixture.message)
    const filename = path.join(__dirname, '/data/fixture.json')

    msg.attachment = filename

    msg['o:tag'] = ['tag1', 'tag2', 'tag3']

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with attachment using stream', (done) => {
    const msg = clone(fixture.message)

    const file = request('https://www.google.ca/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png')

    msg.attachment = file

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with attachment using Attachment object (stream)', (done) => {
    const msg = clone(fixture.message)

    const filename = '/data/mailgun_logo.png'
    const filepath = path.join(__dirname, filename)
    const fileStream = fs.createReadStream(filepath)
    const fileStat = fs.statSync(filepath)

    msg.attachment = new mailgun.Attachment({
      'data': fileStream,
      'filename': 'my_custom_name.png',
      'knownLength': fileStat.size,
      'contentType': 'image/png'
    })

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with attachment using Attachment object (stream) and only filename', (done) => {
    const msg = clone(fixture.message)

    const file = request('https://www.google.ca/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png')

    msg.attachment = new mailgun.Attachment({
      'data': file,
      'filename': 'my_custom_name.png'
    })

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with custom data', (done) => {
    const msg = clone(fixture.message)

    msg['v:whatever'] = 123
    msg['v:test'] = true

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test messages().send() with custom data as object', (done) => {
    const msg = clone(fixture.message)

    msg['v:my-custom-data'] = {
      'whatever': 123,
      'test': true
    }

    mailgun.messages().send(msg, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  describe('Retry', () => {
    it('messages().send() should work with retry option', (done) => {
      const mg = new mailgun.Mailgun({
        'apiKey': auth.api_key,
        'domain': auth.domain,
        'retry': 3
      })

      const msg = clone(fixture.message)

      mg.messages().send(msg, (err, body) => {
        assert.ifError(err)
        assert.ok(body.id)
        assert.ok(body.message)
        assert(/Queued. Thank you./.test(body.message))
        done()
      })
    })

    it('messages().send() should retry when request fails', (done) => {
      process.env.DEBUG_MAILGUN_FORCE_RETRY = true
      const mg = new mailgun.Mailgun({
        'apiKey': auth.api_key,
        'domain': auth.domain,
        'retry': 3
      })

      const msg = clone(fixture.message)

      mg.messages().send(msg, (err, body) => {
        assert.ifError(err)
        assert.ok(body.id)
        assert.ok(body.message)
        assert(/Queued. Thank you./.test(body.message))
        done()
      })
    })

    it('messages().send() should work with retry option as an object', (done) => {
      const mg = new mailgun.Mailgun({
        'apiKey': auth.api_key,
        'domain': auth.domain,
        'retry': {
          'times': 3,
          'interval': 100
        }
      })

      const msg = clone(fixture.message)

      mg.messages().send(msg, (err, body) => {
        assert.ifError(err)
        assert.ok(body.id)
        assert.ok(body.message)
        assert(/Queued. Thank you./.test(body.message))
        done()
      })
    })

    it('messages().send() should retry when request fails with a delay of 100 ms between attempts', (done) => {
      process.env.DEBUG_MAILGUN_FORCE_RETRY = true
      const mg = new mailgun.Mailgun({
        'apiKey': auth.api_key,
        'domain': auth.domain,
        'retry': {
          'times': 3,
          'interval': 100
        }
      })

      const msg = clone(fixture.message)

      mg.messages().send(msg, (err, body) => {
        assert.ifError(err)
        assert.ok(body.id)
        assert.ok(body.message)
        assert(/Queued. Thank you./.test(body.message))
        done()
      })
    })
  })
})
