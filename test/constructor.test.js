const auth = require('./data/auth.json')
const assert = require('assert')

const mailgun = require('../')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Constructor', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('instance constructor', () => {
    const mg = new mailgun.Mailgun({
      'apiKey': auth.api_key,
      'domain': auth.domain
    })

    assert.ok(mg)
    assert.ok(mg instanceof mailgun.Mailgun)
    assert.ok(mg instanceof mg.Mailgun)
  })
})
