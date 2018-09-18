const auth = require('./data/auth.json')
const assert = require('assert')

const mailgun = require('../')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Email Validation', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test mailgun.validate() should validate one email address', (done) => {
    const mg = new mailgun.Mailgun({
      'apiKey': auth.api_key,
      'publicApiKey': auth.public_api_key,
      'domain': auth.domain
    })

    mg.validate('raboof@gmail.com', (err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })

  it('test mailgun.validate() should validate one email address using private option', (done) => {
    const mg = new mailgun.Mailgun({
      'apiKey': auth.api_key,
      'publicApiKey': auth.public_api_key,
      'domain': auth.domain
    })

    mg.validate('raboof@gmail.com', true, (err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })

  it('test mailgun.parse() should parse list of email addresses', (done) => {
    const mg = new mailgun.Mailgun({
      'apiKey': auth.api_key,
      'publicApiKey': auth.public_api_key,
      'domain': auth.domain
    })

    mg.parse(['raboof@gmail.com'], (err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })

  it('test mailgun.parse() should parse list of email addresses with an option', (done) => {
    const mg = new mailgun.Mailgun({
      'apiKey': auth.api_key,
      'publicApiKey': auth.public_api_key,
      'domain': auth.domain
    })

    mg.parse(['raboof@gmail.com'], {
      'syntax_only': false
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })

  it('test mailgun.parse() should private parse list of email addresses with an option', (done) => {
    const mg = new mailgun.Mailgun({
      'apiKey': auth.api_key,
      'publicApiKey': auth.public_api_key,
      'domain': auth.domain
    })

    mg.parse(['raboof@gmail.com'], true, {
      'syntax_only': false
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })

  it('test mailgun.parse() should parse list of email addresses using private option', (done) => {
    const mg = new mailgun.Mailgun({
      'apiKey': auth.api_key,
      'publicApiKey': auth.public_api_key,
      'domain': auth.domain
    })

    mg.parse(['raboof@gmail.com'], true, (err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })
})
