var Mailgun = require('../mailgun');
var assert = require('assert');

try {
  var auth = require('./auth.json');
  var fixture = require('./fixture.json');
  var mailgun = new Mailgun(auth.api_key, auth.domain);
}
catch (err) {
  console.error(err);
  console.error('The tests require ./auth.json to contain a JSON string ' +
    'with Mailgun API key and domain.');
  process.exit(1);
}

var routeId = -1;

module.exports = {
  before: function () {
    mailgun.createMailbox(fixture.mailbox, function (err, res, body) {
      if (err) {
        console.log(err);
        throw new Error('Failed to create sample mailbox for test setup');
      }
    });

    mailgun.createRoute(fixture.route, function (err, res, body) {
      if (err) {
        console.log(err);
        throw new Error('Failed to create sample route for test setup');
      }
      else {
        routeId = body.route.id;
      }
    });
  },

  'test constructor invalid missing params': function () {
    assert.throws(
      function () {
        var m = new Mailgun();
      },
      /Mailgun "API key" required/
    );
  },

  'test constructor invalid missing domain': function () {
    assert.throws(
      function () {
        var m = new Mailgun('foo');
      },
      /Mailgun "domain" required/
    );
  },

  'test constructor': function () {
    var m = new Mailgun('foobar', 'mydomain');

    assert.equal('foobar', m.api_key);
    assert.equal('mydomain', m.domain);
  },

  'test sendMessage() invalid "to"': function (done) {
    mailgun.sendMessage({}, function (err, res, body) {
      assert.ok(err);
      assert(/must include a "to" parameter/.test(err.message));
      done();
    });
  },

  'test sendMessage() invalid "from"': function (done) {
    mailgun.sendMessage({to: fixture.message.to}, function (err, res, body) {
      assert.ok(err);
      assert(/must include a "from" parameter/.test(err.message));
      done();
    });
  },

  'test sendMessage() invalid "text" or "html"': function (done) {
    mailgun.sendMessage(
      {
        to: fixture.message.to,
        from: fixture.message.from
      }, function (err, res, body) {
        assert.ok(err);
        assert(/must include a "text" or "html" parameter/.test(err.message));
        done();
      });
  },

  'test sendMessage()': function (done) {
    mailgun.sendMessage(fixture.message, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.id);
      assert.ok(body.message);
      assert(/Queued. Thank you./.test(body.message));
      done();
    });
  },

  'test getMailboxes()': function (done) {
    mailgun.getMailboxes(function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.total_count);
      assert.ok(body.items);
      done();
    });
  },

  'test createMailbox() invalid mailbox name': function (done) {
    mailgun.createMailbox({password: 'password'}, function (err, res, body) {
      assert.ok(err);
      assert(/must include name of the mailbox/.test(err.message));
      done();
    });
  },

  'test createMailbox() invalid password': function (done) {
    mailgun.createMailbox({mailbox: 'mailbox'}, function (err, res, body) {
      assert.ok(err);
      assert(/must include a password/.test(err.message));
      done();
    });
  },

  'test createMailbox()': function (done) {
    mailgun.createMailbox({mailbox: 'testmailbox', password: 'password'}, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Created 1 mailboxes/.test(body.message));
      done();
    });
  },

  'test updateMailbox() invalid missing mailbox': function (done) {
    mailgun.updateMailbox({}, function (err, res, body) {
      assert.ok(err);
      assert(/must include name of the mailbox/.test(err.message));
      done();
    });
  },

  'test updateMailbox() invalid missing password': function (done) {
    mailgun.updateMailbox({mailbox: 'samplemailbox'}, function (err, res, body) {
      assert.ok(err);
      assert(/must include a password/.test(err.message));
      done();
    });
  },

  'test updateMailbox()': function (done) {
    mailgun.updateMailbox({mailbox: fixture.mailbox.mailbox, password: 'password2'}, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Password changed/.test(body.message));
      done();
    });
  },

  'test deleteMailbox()': function (done) {
    mailgun.deleteMailbox(fixture.mailbox.mailbox, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Mailbox has been deleted/.test(body.message));
      done();
    });
  },

  'test getRoutes()': function (done) {
    mailgun.getRoutes(function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.total_count);
      assert.ok(body.items);
      done();
    });
  },

  'test getRoute() invalid id type': function (done) {
    mailgun.getRoute(123, function (err, res, body) {
      assert.ok(err);
      assert(/must include id of the route/.test(err.message));
      done();
    });
  },

  'test getRoute()': function (done) {
    mailgun.getRoute(routeId, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.route);
      assert.equal(routeId, body.route.id);
      done();
    });
  },

  'test createRoute() invalid missing expression': function (done) {
    mailgun.createRoute({}, function (err, res, body) {
      assert.ok(err);
      assert(/must include route expression/.test(err.message));
      done();
    });
  },

  'test createRoute() invalid missing action': function (done) {
    mailgun.createRoute({expression: 'match_recipient(".*@samples.mailgun.org")'}, function (err, res, body) {
      assert.ok(err);
      assert(/must include route action/.test(err.message));
      done();
    });
  },

  'test createRoute()': function (done) {
    mailgun.createRoute(
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

  'test updateRoute() invalid id type': function (done) {
    mailgun.updateRoute(1234,
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

  'test updateRoute()': function (done) {
    mailgun.updateRoute(routeId,
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

  'test deleteRoute() invalid id type': function (done) {
    mailgun.deleteRoute(1234, function (err, res, body) {
      assert.ok(err);
      assert(/must include the id of the route/.test(err.message));
      done();
    });
  },

  'test deleteRoute()': function (done) {
    mailgun.deleteRoute(routeId, function (err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.ok(body.message);
      assert(/Route has been deleted/.test(body.message));
      assert.equal(routeId, body.id);
      done();
    });
  }
};