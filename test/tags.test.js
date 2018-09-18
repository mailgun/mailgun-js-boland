const auth = require('./data/auth.json')
const assert = require('assert')

const mailgun = require('../')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Tags', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test mailgun.tags().list()', (done) => {
    mailgun.tags().list((err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })

  it('test mailgun.tags().info()', (done) => {
    mailgun.tags('tag1').info((err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })

  it('test mailgun.tags().stats().info()', (done) => {
    mailgun.tags('tag1').stats().info({
      event: ['accepted', 'delivered', 'opened', 'clicked']
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })

  it('test mailgun.tags().aggregates().countries().list()', (done) => {
    mailgun.tags('tag1').stats().aggregates().countries().list((err, body) => {
      assert.ifError(err)
      assert.ok(body)
      assert.ok(body.countries)
      done()
    })
  })

  it('test mailgun.tags().aggregates().providers().list()', (done) => {
    mailgun.tags('tag1').stats().aggregates().providers().list((err, body) => {
      assert.ifError(err)
      assert.ok(body)
      assert.ok(body.providers)
      done()
    })
  })

  it('test mailgun.tags().aggregates().devices().list()', (done) => {
    mailgun.tags('tag1').stats().aggregates().devices().list((err, body) => {
      assert.ifError(err)
      assert.ok(body)
      assert.ok(body.devices)
      done()
    })
  })

  it('test mailgun.tags().delete()', (done) => {
    mailgun.tags('tag1').delete((err, body) => {
      assert.ifError(err)
      assert.ok(body.message)
      done()
    })
  })
})
