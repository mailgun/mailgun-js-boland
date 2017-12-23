const auth = require('./data/auth.json')
const assert = require('assert')

const mailgun = require('../lib/mailgun')({
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

  it('test mailgun.tags().delete()', (done) => {
    mailgun.tags('tag1').delete((err, body) => {
      assert.ifError(err)
      assert.ok(body.message)
      done()
    })
  })
})
