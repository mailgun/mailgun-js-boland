const auth = require('./data/auth.json')
const assert = require('assert')

const mailgun = require('../')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Events', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test mailgun.events().get() simple recipient query', (done) => {
    const query = {
      'begin': 'Fri, 3 May 2013 09:00:00 -0000',
      'ascending': 'yes',
      'limit': 25,
      'pretty': 'yes',
      'recipient': 'mm@samples.mailgun.org'
    }

    mailgun.events().get(query, (err, body) => {
      assert.ifError(err)
      assert.ok(body.items)
      done()
    })
  })

  it('test mailgun.events().get() simple event query', (done) => {
    const query = {
      'event': 'rejected OR failed'
    }

    mailgun.events().get(query, (err, body) => {
      assert.ifError(err)
      assert.ok(body.items)
      done()
    })
  })

  it('test mailgun.events().get() without any params', (done) => {
    mailgun.events().get((err, body) => {
      assert.ifError(err)
      assert.ok(body.items)
      done()
    })
  })
})
