try {
  var auth = require('./auth.json');
  var fixture = require('./fixture.json');
  var assert = require('assert');
  var mailgun = require('../mailgun')(auth.api_key, auth.domain);
}
catch (err) {
  console.error(err);
  console.error('The tests require ./auth.json to contain a JSON string ' +
    'with Mailgun API key and domain.');
  process.exit(1);
}

var routeId = -1;

function cleanup(fn) {
  var counter = 0;
  // lame hack
  var finishAfter = function () {
    counter = counter + 1;
    if (counter >= 4) {
      if (fn) {
        fn();
      }
    }
  };

  mailgun.mailboxes.del(fixture.mailbox.mailbox, function (err, res, body) {
    finishAfter();
  });

  mailgun.routes.del(routeId, function (err, res, body) {
    finishAfter();
  });

  mailgun.lists.del(fixture.mailingList.address, function (err, res, body) {
    finishAfter();
  });

  mailgun.domains.del(fixture.domain.name, function (err, res, body) {
    finishAfter();
  });
}

module.exports = {

  before: function (fn) {
    console.log('Setup');
    // first clean up so we hopefully don't run into limit errors
    cleanup(function () {
      var counter = 0;
      var finish = function () {
        counter = counter + 1;
        if (counter >= 4) {
          if (fn) {
            console.log('Starting tests...\n');
            fn();
          }
        }
      };

      mailgun.mailboxes.create(fixture.mailbox, function (err, res, body) {
        if (err) {
          console.log(err);
          throw new Error('Failed to create sample mailbox for test setup');
        }
        finish();
      });

      mailgun.routes.create(fixture.route, function (err, res, body) {
        if (err) {
          console.log(err);
          throw new Error('Failed to create sample route for test setup');
        }
        else {
          routeId = body.route.id;
        }
        finish();
      });

      mailgun.lists.create(fixture.mailingList, function (err, res, body) {
        if (err) {
          console.log(err);
          throw new Error('Failed to create sample mailing list for test setup');
        }
        finish();
      });

      mailgun.domains.create(fixture.domain, function (err, res, body) {
        if (err) {
          console.log(err);
          throw new Error('Failed to create sample domain for test setup');
        }
        finish();
      });
    });
  },

  after: function (fn) {
    console.log('Cleanup');
    cleanup(fn);
  },

  'test messages.send() invalid "to"': function (done) {
    mailgun.messages.send({}, function (err, res, body) {
      assert.ok(err);
      assert(/must include a "to" parameter/.test(err.message));
      done();
    });
  },

  'test messages.send() invalid "from"': function (done) {
    mailgun.messages.send({to: fixture.message.to}, function (err, res, body) {
      assert.ok(err);
      assert(/must include a "from" parameter/.test(err.message));
      done();
    });
  },

  'test messages.send() invalid "text" or "html"': function (done) {
    mailgun.messages.send(
      {
        to: fixture.message.to,
        from: fixture.message.from
      }, function (err, res, body) {
        assert.ok(err);
        assert(/must include a "text" or "html" parameter/.test(err.message));
        done();
      });
  },

  'test messages.send()': function (done) {
    mailgun.messages.send(fixture.message, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.id);
      assert.ok(body.message);
      assert(/Queued. Thank you./.test(body.message));
      done();
    });
  },

  'test mailboxes.list()': function (done) {
    mailgun.mailboxes.list(function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.total_count);
      assert.ok(body.items);
      done();
    });
  },

  'test mailboxes.create() invalid mailbox name': function (done) {
    mailgun.mailboxes.create({password: 'password'}, function (err, res, body) {
      assert.ok(err);
      assert(/must include name of the mailbox/.test(err.message));
      done();
    });
  },

  'test mailboxes.create() invalid password': function (done) {
    mailgun.mailboxes.create({mailbox: 'mailbox'}, function (err, res, body) {
      assert.ok(err);
      assert(/must include a password/.test(err.message));
      done();
    });
  },

  'test mailboxes.create()': function (done) {
    mailgun.mailboxes.create({mailbox: 'testmailbox', password: 'password'}, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Created 1 mailboxes/.test(body.message));
      done();
    });
  },

  'test mailboxes.update() invalid missing mailbox': function (done) {
    mailgun.mailboxes.update({}, function (err, res, body) {
      assert.ok(err);
      assert(/must include name of the mailbox/.test(err.message));
      done();
    });
  },

  'test mailboxes.update() invalid missing password': function (done) {
    mailgun.mailboxes.update({mailbox: 'samplemailbox'}, function (err, res, body) {
      assert.ok(err);
      assert(/must include a password/.test(err.message));
      done();
    });
  },

  'test mailboxes.update()': function (done) {
    mailgun.mailboxes.update({mailbox: fixture.mailbox.mailbox, password: 'password2'}, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Password changed/.test(body.message));
      done();
    });
  },

  'test mailboxes.del()': function (done) {
    mailgun.mailboxes.del(fixture.mailbox.mailbox, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Mailbox has been deleted/.test(body.message));
      done();
    });
  },

  'test routes.list()': function (done) {
    mailgun.routes.list(function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.total_count);
      assert.ok(body.items);
      done();
    });
  },

  'test routes.get() invalid id type': function (done) {
    mailgun.routes.get(123, function (err, res, body) {
      assert.ok(err);
      assert(/must include id of the route/.test(err.message));
      done();
    });
  },

  'test routes.get()': function (done) {
    mailgun.routes.get(routeId, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.route);
      assert.equal(routeId, body.route.id);
      done();
    });
  },

  'test routes.create() invalid missing expression': function (done) {
    mailgun.routes.create({}, function (err, res, body) {
      assert.ok(err);
      assert(/must include route expression/.test(err.message));
      done();
    });
  },

  'test routes.create() invalid missing action': function (done) {
    mailgun.routes.create({expression: 'match_recipient(".*@samples.mailgun.org")'}, function (err, res, body) {
      assert.ok(err);
      assert(/must include route action/.test(err.message));
      done();
    });
  },

  'test routes.create()': function (done) {
    mailgun.routes.create(
      {
        description: 'test new route',
        expression: 'match_recipient(".*@samples.mailgun.org")',
        action: 'forward("http://myhost.com/messages/")'
      }, function (err, res, body) {
        assert.ifError(err);
        assert.equal(200, res.statusCode);
        assert.ok(body.message);
        assert(/Route has been created/.test(body.message));
        assert.ok(body.route);
        done();
      });
  },

  'test routes.update() invalid id type': function (done) {
    mailgun.routes.update(1234,
      {
        description: 'test new route update',
        expression: 'match_recipient(".*@samples.mailgun.org")',
        action: 'forward("http://myhost.com/messages/")'
      }, function (err, res, body) {
        assert.ok(err);
        assert(/must include id of the route/.test(err.message));
        done();
      });
  },

  'test routes.update()': function (done) {
    mailgun.routes.update(routeId,
      {
        description: 'test new route update',
        expression: 'match_recipient(".*@samples.mailgun.org")',
        action: 'forward("http://myhost.com/messages/")'
      }, function (err, res, body) {
        assert.ifError(err);
        assert.equal(200, res.statusCode);
        assert.ok(body.message);
        assert(/Route has been updated/.test(body.message));
        assert.equal(routeId, body.id);
        done();
      });
  },

  'test routes.del() invalid id type': function (done) {
    mailgun.routes.del(1234, function (err, res, body) {
      assert.ok(err);
      assert(/must include the id of the route/.test(err.message));
      done();
    });
  },

  'test routes.del()': function (done) {
    mailgun.routes.del(routeId, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Route has been deleted/.test(body.message));
      assert.equal(routeId, body.id);
      done();
    });
  },

  'test lists.list()': function (done) {
    mailgun.lists.list(function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.total_count);
      assert.ok(body.items);
      done();
    });
  },

  'test lists.get() invalid address type': function (done) {
    mailgun.lists.get(123, function (err, res, body) {
      assert.ok(err);
      assert(/must include mailing list address/.test(err.message));
      done();
    });
  },

  'test lists.get()': function (done) {
    mailgun.lists.get(fixture.mailingList.address, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.list);
      assert.equal(fixture.mailingList.address, body.list.address);
      assert.equal(fixture.mailingList.name, body.list.name);
      done();
    });
  },

  'test lists.create() invalid missing address': function (done) {
    mailgun.lists.create({}, function (err, res, body) {
      assert.ok(err);
      assert(/must include mailing list address/.test(err.message));
      done();
    });
  },

  'test lists.create()': function (done) {
    var address = 'devs@samples.mailgun.org';
    var name = 'TestList';
    var description = 'Sample test mailing list';
    mailgun.lists.create(
      {
        address: address,
        name: name,
        description: description
      }, function (err, res, body) {
        assert.ifError(err);
        assert.equal(200, res.statusCode);
        assert.ok(body.message);
        assert(/Mailing list has been created/.test(body.message));
        assert.ok(body.list);
        assert.equal(address, body.list.address);
        assert.equal(name, body.list.name);
        assert.equal(description, body.list.description);
        done();
      });
  },

  'test lists.update() invalid address type': function (done) {
    mailgun.lists.update(1234,
      {
        name: 'Test List Updated',
        description: 'My new test mailing list'
      }, function (err, res, body) {
        assert.ok(err);
        assert(/must include mailing list address/.test(err.message));
        done();
      });
  },

  'test lists.update()': function (done) {
    var name = 'Test List Updated';
    var desc = 'My updated test mailing list';
    mailgun.lists.update(fixture.mailingList.address,
      {
        name: name,
        description: desc
      }, function (err, res, body) {
        assert.ifError(err);
        assert.equal(200, res.statusCode);
        assert.ok(body.message);
        assert(/Mailing list has been updated/.test(body.message));
        assert.equal(fixture.mailingList.address, body.list.address);
        assert.equal(name, body.list.name);
        assert.equal(desc, body.list.description);
        done();
      });
  },

  'test lists.del() invalid address type': function (done) {
    mailgun.lists.del(123, function (err, res, body) {
      assert.ok(err);
      assert(/must include mailing list address/.test(err.message));
      done();
    });
  },

  'test lists.del()': function (done) {
    var address = 'devs@samples.mailgun.org';
    mailgun.lists.del(address, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Mailing list has been deleted/.test(body.message));
      assert.equal(address, body.address);
      done();
    });
  },

  'test lists.members.create() invalid list address': function (done) {
    mailgun.lists.members.create(1234, {}, function (err, res, body) {
      assert.ok(err);
      assert(/must include mailing list address/.test(err.message));
      done();
    });
  },

  'test lists.members.create() no data': function (done) {
    mailgun.lists.members.create('devs@samples.mailgun.org', function (err, res, body) {
      assert.ok(err);
      assert(/must include data/.test(err.message));
      done();
    });
  },

  'test lists.members.create() invalid data': function (done) {
    mailgun.lists.members.create('devs@samples.mailgun.org', 1234, function (err, res, body) {
      assert.ok(err);
      assert(/must include data/.test(err.message));
      done();
    });
  },

  'test lists.members.create() missing address': function (done) {
    mailgun.lists.members.create('devs@samples.mailgun.org', {}, function (err, res, body) {
      assert.ok(err);
      assert(/must include member address/.test(err.message));
      done();
    });
  },

  'test lists.members.create() invalid member address': function (done) {
    mailgun.lists.members.create('devs@samples.mailgun.org', {address: 123}, function (err, res, body) {
      assert.ok(err);
      assert(/must include member address/.test(err.message));
      done();
    });
  },

  'test lists.members.create()': function (done) {
    var data = {
      subscribed: true,
      address: 'bob@gmail.com',
      name: 'Bob Bar',
      vars: {age: 26}
    };

    mailgun.lists.members.create(fixture.mailingList.address, data, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Mailing list member has been created/.test(body.message));
      assert.ok(body.member);
      assert.ok(body.member.vars);
      assert.equal(data.subscribed, body.member.subscribed);
      assert.equal(data.address, body.member.address);
      assert.equal(data.name, body.member.name);
      assert.equal(data.vars.age, body.member.vars.age);
      done();
    });
  },

  'test lists.members.list() invalid list address': function (done) {
    mailgun.lists.members.list(1234, function (err, res, body) {
      assert.ok(err);
      assert(/must include mailing list address/.test(err.message));
      done();
    });
  },

  'test lists.members.list()': function (done) {
    mailgun.lists.members.list(fixture.mailingList.address, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.total_count);
      assert.ok(body.items);
      done();
    });
  },

  'test lists.members.get() invalid list address': function (done) {
    mailgun.lists.members.get(1234, function (err, res, body) {
      assert.ok(err);
      assert(/must include mailing list address/.test(err.message));
      done();
    });
  },

  'test lists.members.get() invalid member address': function (done) {
    mailgun.lists.members.get(fixture.mailingList.address, 1234, function (err, res, body) {
      assert.ok(err);
      assert(/must include member address/.test(err.message));
      done();
    });
  },

  'test lists.members.get()': function (done) {
    var data = {
      subscribed: true,
      address: 'bob@gmail.com',
      name: 'Bob Bar',
      vars: {age: 26}
    };

    mailgun.lists.members.get(fixture.mailingList.address, 'bob@gmail.com', function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.member);
      assert.ok(body.member.vars);
      assert.equal(data.subscribed, body.member.subscribed);
      assert.equal(data.address, body.member.address);
      assert.equal(data.name, body.member.name);
      assert.equal(data.vars.age, body.member.vars.age);
      done();
    });
  },

  'test lists.members.update() no data': function (done) {
    mailgun.lists.members.update('devs@samples.mailgun.org', 'bob@gmail.com', function (err, res, body) {
      assert.ok(err);
      assert(/must include data/.test(err.message));
      done();
    });
  },

  'test lists.members.update() invalid data': function (done) {
    mailgun.lists.members.update('devs@samples.mailgun.org', 'bob@gmail.com', 1234, function (err, res, body) {
      assert.ok(err);
      assert(/must include data/.test(err.message));
      done();
    });
  },

  'test lists.members.update() invalid member address': function (done) {
    mailgun.lists.members.update('devs@samples.mailgun.org', {}, {}, function (err, res, body) {
      assert.ok(err);
      assert(/must include member address/.test(err.message));
      done();
    });
  },

  'test lists.members.update() missing/invalid member address 2': function (done) {
    mailgun.lists.members.update('devs@samples.mailgun.org', 1234, {}, function (err, res, body) {
      assert.ok(err);
      assert(/must include member address/.test(err.message));
      done();
    });
  },

  'test lists.members.update()': function (done) {
    var data = {
      subscribed: false,
      address: 'foo@gmail.com',
      name: 'Foo Bar',
      vars: {age: 36}
    };

    mailgun.lists.members.update(fixture.mailingList.address, 'bob@gmail.com', data, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Mailing list member has been updated/.test(body.message));
      assert.ok(body.member);
      assert.ok(body.member.vars);
      assert.equal(data.subscribed, body.member.subscribed);
      assert.equal(data.address, body.member.address);
      assert.equal(data.name, body.member.name);
      assert.equal(data.vars.age, body.member.vars.age);
      done();
    });
  },

  'test lists.members.del() invalid list address type': function (done) {
    mailgun.lists.members.del(123, function (err, res, body) {
      assert.ok(err);
      assert(/must include mailing list address/.test(err.message));
      done();
    });
  },

  'test lists.members.del() missing member address': function (done) {
    mailgun.lists.members.del(fixture.mailingList.address, function (err, res, body) {
      assert.ok(err);
      assert(/must include member address/.test(err.message));
      done();
    });
  },

  'test lists.members.del() invalid member address 1': function (done) {
    mailgun.lists.members.del(fixture.mailingList.address, 1234, function (err, res, body) {
      assert.ok(err);
      assert(/must include member address/.test(err.message));
      done();
    });
  },

  'test lists.members.del() invalid member address 2': function (done) {
    mailgun.lists.members.del(fixture.mailingList.address, {}, function (err, res, body) {
      assert.ok(err);
      assert(/must include member address/.test(err.message));
      done();
    });
  },

  'test lists.members.del()': function (done) {
    var address = 'foo@gmail.com';
    mailgun.lists.members.del(fixture.mailingList.address, address, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Mailing list member has been deleted/.test(body.message));
      assert.ok(body.member);
      assert.ok(body.member.address);
      assert.equal(address, body.member.address);
      done();
    });
  },

  'test domains.list()': function (done) {
    mailgun.domains.list(function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.total_count);
      assert.ok(body.items);
      done();
    });
  },

  'test domains.get() invalid domain type': function (done) {
    mailgun.domains.get(123, function (err, res, body) {
      assert.ok(err);
      assert(/must include domain name/.test(err.message));
      done();
    });
  },

  'test domains.get()': function (done) {
    mailgun.domains.get(fixture.domain.name, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.domain);
      assert.equal(fixture.domain.name, body.domain.name);
      assert.equal(fixture.domain.smtp_password, body.domain.smtp_password);
      done();
    });
  },

  'test domains.del() invalid name type': function (done) {
    mailgun.domains.del(123, function (err, res, body) {
      assert.ok(err);
      assert(/must include domain name/.test(err.message));
      done();
    });
  },

  'test domains.del()': function (done) {
    var domain = fixture.domain.name;
    mailgun.domains.del(domain, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Domain has been deleted/.test(body.message));
      done();
    });
  },

  'test domains.create() invalid missing address': function (done) {
    mailgun.domains.create({}, function (err, res, body) {
      assert.ok(err);
      assert(/must include domain name/.test(err.message));
      done();
    });
  },

  'test domains.create() invalid missing smtp password': function (done) {
    mailgun.domains.create({ name: 'units.mailgun.org' }, function (err, res, body) {
      assert.ok(err);
      assert(/must include SMTP password/.test(err.message));
      done();
    });
  },

  'test domains.create() ': function (done) {
    mailgun.domains.create(fixture.domain, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Domain has been created/.test(body.message));
      assert.ok(body.domain);
      assert.equal(fixture.domain.name, body.domain.name);
      assert.equal(fixture.domain.smtp_password, body.domain.smtp_password);
      done();
    });
  }
};