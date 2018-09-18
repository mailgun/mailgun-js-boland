const auth = require('./data/auth.json')
const fixture = require('./data/fixture.json')
const assert = require('assert')

const mailgun = require('../')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Mailing lists', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test lists().create() invalid missing address', (done) => {
    mailgun.lists().create({}, (err) => {
      assert.ok(err)
      assert(/Missing parameter 'address'/.test(err.message))
      done()
    })
  })

  it('test lists.create()', (done) => {
    mailgun.lists().create(fixture.mailingList, (err, body) => {
      assert.ifError(err)
      assert.ok(body.message)
      assert.ok(body.list)
      assert.strictEqual(fixture.mailingList.address, body.list.address)
      assert.strictEqual(fixture.mailingList.name, body.list.name)
      assert.strictEqual(fixture.mailingList.description, body.list.description)
      done()
    })
  })

  it('test lists.list()', (done) => {
    mailgun.lists().list((err, body) => {
      assert.ifError(err)
      assert.ok(body.total_count)
      assert.ok(body.items)
      done()
    })
  })

  it('test lists().info()', (done) => {
    mailgun.lists(fixture.mailingList.address).info((err, body) => {
      assert.ifError(err)
      assert.ok(body.list)
      assert.ok(body.list.address)
      assert.ok(body.list.name)
      done()
    })
  })

  it('test lists().update()', (done) => {
    const name = 'List Updated'
    const desc = 'My updated test mailing list'

    mailgun.lists(fixture.mailingList.address).update({
      name,
      'description': desc
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(body.message)
      assert.strictEqual(fixture.mailingList.address, body.list.address)
      assert.strictEqual(name, body.list.name)
      assert.strictEqual(desc, body.list.description)
      done()
    })
  })

  it('test lists().members().create() no member address', (done) => {
    mailgun.lists(fixture.mailingList.address).members().create({}, (err) => {
      assert.ok(err)
      assert(/Missing parameter 'address'/.test(err.message))
      done()
    })
  })

  it('test lists().members().create() invalid address type', (done) => {
    mailgun.lists(fixture.mailingList.address).members().create({
      'address': 1234
    }, (err) => {
      assert.ok(err)
      assert(/Invalid parameter type./.test(err.message))
      done()
    })
  })

  it('test lists().members().create()', (done) => {
    const data = {
      'subscribed': true,
      'address': 'bob@gmail.com',
      'name': 'Bob Bar',
      'vars': {
        'age': 26
      }
    }

    mailgun.lists(fixture.mailingList.address).members().create(data, (err, body) => {
      assert.ifError(err)
      assert.ok(body.message)
      assert.ok(body.member)
      assert.ok(body.member.address)
      assert.ok(body.member.name)
      assert.ok(body.member.vars)
      assert.strictEqual(data.subscribed, body.member.subscribed)
      assert.strictEqual(data.address, body.member.address)
      assert.strictEqual(data.name, body.member.name)
      assert.strictEqual(data.vars.age, body.member.vars.age)
      done()
    })
  })

  it('test lists().members().list()', (done) => {
    mailgun.lists(fixture.mailingList.address).members().list((err, body) => {
      assert.ifError(err)
      assert.ok(body.total_count >= 0)
      assert.ok(body.items)
      done()
    })
  })

  it('test lists().members().pages().page()', (done) => {
    mailgun.lists(fixture.mailingList.address).members().pages().page({
      'page': 'first'
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(Array.isArray(body.items))
      assert.ok(typeof body.paging === 'object')
      done()
    })
  })

  it('test lists.members().info()', (done) => {
    const data = {
      'subscribed': true,
      'address': 'bob@gmail.com',
      'name': 'Bob Bar',
      'vars': {
        'age': 26
      }
    }

    mailgun.lists(fixture.mailingList.address).members('bob@gmail.com').info((err, body) => {
      assert.ifError(err)
      assert.ok(body.member)
      assert.ok(body.member.vars)
      assert.strictEqual(data.subscribed, body.member.subscribed)
      assert.strictEqual(data.address, body.member.address)
      assert.strictEqual(data.name, body.member.name)
      assert.strictEqual(data.vars.age, body.member.vars.age)
      done()
    })
  })

  it('test lists().members().update()', (done) => {
    const data = {
      'subscribed': false,
      'address': 'foo@gmail.com',
      'name': 'Foo Bar',
      'vars': {
        'age': 36
      }
    }

    mailgun.lists(fixture.mailingList.address).members('bob@gmail.com').update(data, (err, body) => {
      assert.ifError(err)
      assert.ok(body.message)
      assert.ok(body.member)
      assert.ok(body.member.vars)
      assert.strictEqual(data.subscribed, body.member.subscribed)
      assert.strictEqual(data.address, body.member.address)
      assert.strictEqual(data.name, body.member.name)
      assert.strictEqual(data.vars.age, body.member.vars.age)
      done()
    })
  })

  it('test lists().members().delete()', (done) => {
    const address = 'foo@gmail.com'

    mailgun.lists(fixture.mailingList.address).members(address).delete((err, body) => {
      assert.ifError(err)
      assert.ok(body.message)
      done()
    })
  })

  it('test lists().members().add() without upsert', (done) => {
    const members = [{
      'address': 'Alice <alice@example.com>',
      'vars': {
        'age': 26
      }
    },
    {
      'name': 'Bob',
      'address': 'bob@example.com',
      'vars': {
        'age': 34
      }
    }
    ]

    mailgun.lists(fixture.mailingList.address).members().add({
      members
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(body.list)
      assert.ok(body.list.members_count >= 0)
      done()
    })
  })

  it('test lists().members().add()', (done) => {
    const members = [{
      'address': 'Alice <alice@example.com>',
      'vars': {
        'age': 26
      }
    },
    {
      'name': 'Bob',
      'address': 'bob@example.com',
      'vars': {
        'age': 34
      }
    }
    ]

    mailgun.lists(fixture.mailingList.address).members().add({
      members,
      'upsert': true
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(body.list)
      assert.ok(body.list.members_count >= 0)
      done()
    })
  })

  it('test lists().delete()', (done) => {
    mailgun.lists(fixture.mailingList.address).delete((err, body) => {
      assert.ifError(err)
      assert.ok(body)
      assert.ok(body.message)
      done()
    })
  })
})
