const auth = require('./data/auth.json')
const assert = require('assert')

const mailgun = require('../')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Generic requests functions', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test mailgun.get()', (done) => {
    const path = `/${auth.domain}/stats`

    mailgun.get(path, {
      'event': ['sent', 'delivered']
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(body.total_count)
      assert.ok(body.items)
      done()
    })
  })

  it('test mailgun.get() using promises', (done) => {
    const path = `/${auth.domain}/stats`

    mailgun.get(path, {
      'event': ['sent', 'delivered']
    }).then((body) => {
      assert.ok(body.total_count)
      assert.ok(body.items)
      done()
    }).catch((err) => {
      assert.ifError(err)
      done()
    })
  })

  it('test mailgun.get() using promises 2', (done) => {
    const mg = new mailgun.Mailgun({
      'apiKey': auth.public_api_key,
      'domain': auth.domain
    })

    mg.get('/address/validate', {
      'address': 'emailtestmg@gmail.com'
    }).then(body => {
      assert.ok(body)
      done()
    }).catch(err => {
      assert.ifError(err)
      done()
    })
  })
})
