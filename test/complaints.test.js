const auth = require('./data/auth.json')
const fixture = require('./data/fixture.json')
const assert = require('assert')

const mailgun = require('../')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Complaints', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test complaints().create() missing address', (done) => {
    mailgun.complaints().create({}, (err) => {
      assert.ok(err)
      assert(/Missing parameter 'address'/.test(err.message))
      done()
    })
  })

  it('test complaints().create()', (done) => {
    mailgun.complaints().create({
      'address': fixture.complaints.address
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(body.message)
      done()
    })
  })

  it('test complaints().list()', (done) => {
    mailgun.complaints().list((err, body) => {
      assert.ifError(err)
      assert.ok(body.items)
      done()
    })
  })

  it('test complaints().info()', (done) => {
    mailgun.complaints(fixture.complaints.address).info((err, body) => {
      assert.ifError(err)
      assert.ok(body)
      done()
    })
  })

  it('test complaints().delete()', (done) => {
    mailgun.complaints(fixture.complaints.address).delete((err, body) => {
      assert.ifError(err)
      assert.ok(body.message)
      done()
    })
  })
})
