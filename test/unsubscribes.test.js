const auth = require('./data/auth.json')
const fixture = require('./data/fixture.json')
const assert = require('assert')

const mailgun = require('../')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Unsubscribes', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test unsubscribes().create()', (done) => {
    mailgun.unsubscribes().create(fixture.unsubscribe, (err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })

  it('test unsubscribes().create() multi', (done) => {
    mailgun.unsubscribes().create([fixture.unsubscribe, fixture.unsubscribe2], (err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })

  it('test unsubscribes().list()', (done) => {
    mailgun.unsubscribes().list((err, body) => {
      assert.ifError(err)
      assert.ok(body.items)
      done()
    })
  })

  it('test unsubscribes().info()', (done) => {
    mailgun.unsubscribes(fixture.unsubscribe.address).info((err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })

  it('test unsubscribes().delete()', (done) => {
    mailgun.unsubscribes(fixture.unsubscribe.address).delete((err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })
})
