const auth = require('./data/auth.json')
const fixture = require('./data/fixture.json')
const assert = require('assert')
const fs = require('fs')
const path = require('path')
const MailComposer = require('nodemailer/lib/mail-composer')

const mailgun = require('../')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Send MIME', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test sendMime()', (done) => {
    const mailOptions = {
      'from': fixture.message.from,
      'to': fixture.message.to,
      'subject': fixture.message.subject,
      'body': fixture.message.text,
      'html': `<b>${fixture.message.text}</b>`
    }

    const mail = new MailComposer(mailOptions)

    mail.compile().build((err, message) => {
      assert.ifError(err)

      const data = {
        'to': fixture.message.to,
        'message': message.toString('ascii')
      }

      mailgun.messages().sendMime(data, (err, body) => {
        assert.ifError(err)
        assert.ok(body.id)
        assert.ok(body.message)
        assert(/Queued. Thank you./.test(body.message))
        done()
      })
    })
  })

  it('test sendMime() with to field as array', (done) => {
    const mailOptions = {
      'from': fixture.message.from,
      'to': fixture.message.to,
      'subject': fixture.message.subject,
      'body': fixture.message.text,
      'html': `<b>${fixture.message.text}</b>`
    }

    const mail = new MailComposer(mailOptions)

    mail.compile().build((err, message) => {
      assert.ifError(err)

      const data = {
        'to': fixture.message_recipient_vars.to,
        'message': message.toString('ascii')
      }

      mailgun.messages().sendMime(data, (err, body) => {
        assert.ifError(err)
        assert.ok(body.id)
        assert.ok(body.message)
        assert(/Queued. Thank you./.test(body.message))
        done()
      })
    })
  })

  it('test sendMime() with file path', (done) => {
    const filePath = path.join(__dirname, '/data/message.eml')

    const data = {
      'to': fixture.message.to,
      'message': filePath
    }

    mailgun.messages().sendMime(data, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })

  it('test sendMime() with file stream', (done) => {
    const filePath = path.join(__dirname, '/data/message.eml')

    const data = {
      'to': fixture.message.to,
      'message': fs.createReadStream(filePath)
    }

    mailgun.messages().sendMime(data, (err, body) => {
      assert.ifError(err)
      assert.ok(body.id)
      assert.ok(body.message)
      assert(/Queued. Thank you./.test(body.message))
      done()
    })
  })
})
