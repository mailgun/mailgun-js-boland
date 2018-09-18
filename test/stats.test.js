const auth = require('./data/auth.json')
const assert = require('assert')

const mailgun = require('../')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Stats', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test mailgun.stats().list()', (done) => {
    mailgun.stats().list((err, body) => {
      assert.ifError(err)
      assert.ok(body.total_count)
      assert.ok(body.items)
      done()
    })
  })

  it('test mailgun.stats().list() with one argument', (done) => {
    mailgun.stats().list({
      'event': 'delivered'
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(body.total_count)
      assert.ok(body.items)
      done()
    })
  })

  it('test mailgun.stats().list() with arguments', (done) => {
    mailgun.stats().list({
      'event': ['sent', 'delivered']
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(body.total_count)
      assert.ok(body.items)
      done()
    })
  })
})
