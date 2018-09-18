const auth = require('./data/auth.json')
const fixture = require('./data/fixture.json')
const assert = require('assert')

const mailgun = require('../')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

let routeId = -1

describe('Routes', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test routes().create() invalid missing expression', (done) => {
    mailgun.routes().create({}, (err) => {
      assert.ok(err)
      assert(/Missing parameter 'expression'/.test(err.message))
      done()
    })
  })

  it('test routes().create()', (done) => {
    mailgun.routes().create(fixture.route, (err, body) => {
      assert.ifError(err)
      assert.ok(body)
      assert.ok(body.route)
      routeId = body.route.id
      done()
    })
  })

  it('test routes().list()', (done) => {
    mailgun.routes().list((err, body) => {
      assert.ifError(err)
      assert.ok(body.total_count >= 0)
      assert.ok(body.items)
      done()
    })
  })

  it('test routes().info()', (done) => {
    mailgun.routes(routeId).info((err, body) => {
      assert.ifError(err)
      assert.ok(body.route)
      assert.strictEqual(routeId, body.route.id)
      done()
    })
  })

  it('test routes().update() with one action argument', (done) => {
    mailgun.routes(routeId).update({
      'description': 'new route update',
      'expression': 'match_recipient(".*@samples.mailgun.org")',
      'action': 'forward("http://myhost.com/messages/")'
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(body.message)
      assert.strictEqual(routeId, body.id)
      done()
    })
  })

  it('test routes().update() with two action arguments', (done) => {
    mailgun.routes(routeId).update({
      'description': 'test new route update',
      'expression': 'match_recipient(".*@samples.mailgun.org")',
      'action': ['forward("http://myhost.com/messages/")', 'stop()']
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(body.message)
      assert.strictEqual(routeId, body.id)
      done()
    })
  })

  it('test routes().delete()', (done) => {
    mailgun.routes(routeId).delete((err, body) => {
      assert.ifError(err)
      assert.ok(body.message)
      done()
    })
  })
})
