const auth = require('./data/auth.json')
const fixture = require('./data/fixture.json')
const assert = require('assert')

const mailgun = require('../lib/mailgun')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Campaigns', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test campaigns().create() invalid missing address', (done) => {
    mailgun.campaigns().create({}, (err) => {
      assert.ok(err)
      assert(/Missing parameter 'name'/.test(err.message))
      done()
    })
  })

  it('test campaigns().create()', (done) => {
    mailgun.campaigns().create(fixture.campaign, (err, body) => {
      assert.ifError(err)
      assert.ok(body)
      // assert.ok(body.message);
      // assert.ok(body.campaign);
      // assert.equal(fixture.campaign.name, body.campaign.name);
      // assert.equal(fixture.campaign.id, body.campaign.id);
      done()
    })
  })

  it('test campaigns().list() with invalid `limit` param', (done) => {
    mailgun.campaigns().list({
      'limit': 'foo'
    }, (err) => {
      assert.ok(err)
      assert(/Invalid parameter type./.test(err.message))
      done()
    })
  })

  it('test campaigns().list() with invalid `skip` param', (done) => {
    mailgun.campaigns().list({
      'skip': 'bar'
    }, (err) => {
      assert.ok(err)
      assert(/Invalid parameter type./.test(err.message))
      done()
    })
  })

  it('test campaigns().list()', (done) => {
    mailgun.campaigns().list((err, body) => {
      assert.ifError(err)
      assert.ok(body)
      assert.ok(body.total_count)
      assert.ok(body.items)
      done()
    })
  })

  it('test campaigns().info()', (done) => {
    mailgun.campaigns(fixture.campaign.id).info((err, body) => {
      assert.ifError(err)
      assert.ok(body)
      assert.equal(fixture.campaign.id, body.id)
      assert.equal(fixture.campaign.name, body.name)
      done()
    })
  })

  it('test campaigns().update()', (done) => {
    mailgun.campaigns(fixture.campaign.id).update({
      'name': fixture.campaign.newName
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(body)
      assert.ok(body.message)
      assert.ok(body.campaign)
      assert.equal(fixture.campaign.newName, body.campaign.name)
      done()
    })
  })

  it('test campaigns().delete()', (done) => {
    mailgun.campaigns(fixture.campaign.id).delete((err, body) => {
      assert.ifError(err)
      assert.ok(body)
      assert.ok(body.message)
      done()
    })
  })
})
