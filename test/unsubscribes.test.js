const auth = require('./data/auth.json')
const fixture = require('./data/fixture.json')
const assert = require('assert')

const mailgun = require('../lib/mailgun')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Unsubscribes', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test unsubscribes().create() missing address', (done) => {
    mailgun.unsubscribes().create({}, (err) => {
      assert.ok(err)
      assert(/Missing parameter 'address'/.test(err.message))
      done()
    })
  })

  it('test unsubscribes().create() missing tag', (done) => {
    mailgun.unsubscribes().create({
      'address': fixture.unsubscribe.address
    }, (err) => {
      assert.ok(err)
      assert(/Missing parameter 'tag'/.test(err.message))
      done()
    })
  })

  it('test unsubscribes().create() invalid address type', (done) => {
    mailgun.unsubscribes().create({
      'address': 123,
      'tag': fixture.unsubscribe.tag
    }, (err) => {
      assert.ok(err)
      assert(/Invalid parameter type./.test(err.message))
      done()
    })
  })

  it('test unsubscribes().create() invalid tag type', (done) => {
    mailgun.unsubscribes().create({
      'address': fixture.unsubscribe.address,
      'tag': 10
    }, (err) => {
      assert.ok(err)
      assert(/Invalid parameter type./.test(err.message))
      done()
    })
  })

  it('test unsubscribes().create()', (done) => {
    mailgun.unsubscribes().create(fixture.unsubscribe, (err, body) => {
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
