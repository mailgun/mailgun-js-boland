const auth = require('./data/auth.json')
const fixture = require('./data/fixture.json')
const clone = require('clone')
const assert = require('assert')
const path = require('path')
const debug = require('debug')
const sinon = require('sinon')

let mailgun
let log, sandbox

describe('test mode', () => {
  describe('default operation', () => {
    before(() => {
      mailgun = require('../')({
        apiKey: auth.api_key,
        domain: auth.domain,
        testMode: true
      })
    })

    beforeEach(done => {
      setTimeout(done, 100)
    })

    it('test messages().send()', done => {
      const msg = clone(fixture.message)

      mailgun.messages().send(msg, (err, body) => {
        assert.strictEqual(err, undefined)
        assert.strictEqual(body, undefined)

        done()
      })
    })

    it('test messages().send() with attachment using filename', done => {
      const msg = clone(fixture.message)
      const filename = path.join(__dirname, '/data/mailgun_logo.png')

      msg.attachment = filename

      mailgun.messages().send(msg, (err, body) => {
        assert.strictEqual(err, undefined)
        assert.strictEqual(body, undefined)

        done()
      })
    })
  })

  describe('default operation with DEBUG', () => {
    before(() => {
      mailgun = require('../')({
        apiKey: auth.api_key,
        domain: auth.domain,
        testMode: true
      })

      debug.enable('mailgun-js')
    })

    after(() => {
      debug.disable()
    })

    beforeEach(done => {
      setTimeout(done, 100)
    })

    it('test messages().send()', done => {
      const msg = clone(fixture.message)

      mailgun.messages().send(msg, (err, body) => {
        assert.strictEqual(err, undefined)
        assert.strictEqual(body, undefined)

        done()
      })
    })
  })

  describe('custom logger', () => {
    before(() => {
      mailgun = require('../')({
        apiKey: auth.api_key,
        domain: auth.domain,
        testMode: true,
        testModeLogger: (httpOptions, payload, form) => {
          const { method, path } = httpOptions
          const hasPayload = !!payload
          const hasForm = !!form

          console.log(`%s %s payload: %s form: %s`, method, path, hasPayload, hasForm)
        }
      })
    })

    beforeEach(done => {
      sandbox = sinon.createSandbox()
      log = sandbox.spy(console, 'log')

      setTimeout(done, 100)
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('test messages().send()', done => {
      const msg = clone(fixture.message)

      mailgun.messages().send(msg, (err, body) => {
        assert.strictEqual(err, undefined)
        assert.strictEqual(body, undefined)

        assert.ok(log.calledOnce)
        assert.ok(
          log.calledWith(
            `%s %s payload: %s form: %s`,
            'POST',
            '/v3/sandbox77047.mailgun.org/messages',
            true,
            false
          )
        )

        done()
      })
    })

    it('test messages().send() with attachment using filename', done => {
      const msg = clone(fixture.message)
      const filename = path.join(__dirname, '/data/mailgun_logo.png')

      msg.attachment = filename

      mailgun.messages().send(msg, (err, body) => {
        assert.strictEqual(err, undefined)
        assert.strictEqual(body, undefined)

        assert.ok(log.calledOnce)
        assert.ok(
          log.calledWith(
            `%s %s payload: %s form: %s`,
            'POST',
            '/v3/sandbox77047.mailgun.org/messages',
            false,
            true
          )
        )

        done()
      })
    })
  })
})
