const auth = require('./data/auth.json')
const fixture = require('./data/fixture.json')
const assert = require('assert')

const mailgun = require('../')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Bounces', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test bounces().create() missing address', (done) => {
    mailgun.bounces().create({}, (err) => {
      assert.ok(err)
      assert(/Missing parameter 'address'/.test(err.message))
      done()
    })
  })

  it('test bounces().create() invalid address type', (done) => {
    mailgun.bounces().create({
      'address': 123
    }, (err) => {
      assert.ok(err)
      assert(/Invalid parameter type./.test(err.message))
      done()
    })
  })

  it('test bounces().create()', (done) => {
    mailgun.bounces().create(fixture.bounce, (err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })

  it('test bounces().list()', (done) => {
    mailgun.bounces().list((err, body) => {
      assert.ifError(err)
      assert.ok(body.items)
      done()
    })
  })

  it('test bounces().info()', (done) => {
    mailgun.bounces(fixture.bounce.address).info((err, body) => {
      assert.ifError(err)
      assert.ok(body)
      assert.ok(body.address)
      done()
    })
  })

  it('test bounces().delete()', (done) => {
    mailgun.bounces(fixture.bounce.address).delete((err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })
})
