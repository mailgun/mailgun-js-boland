var auth = require('./auth.json');
var fixture = require('./fixture.json');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var Mailgun = require('../lib/mailgun');

var mailgun = new Mailgun({apiKey: auth.api_key, domain: auth.domain});

var routeId = -1;

module.exports = {

  /*
   * Messages
   */

  'test messages.send() invalid "from"': function (done) {
    mailgun.messages().send({to: fixture.message.to}, function (err, body) {
      assert.ok(err);
      assert(/Missing parameter 'from'/.test(err.message));
      done();
    });
  },

  'test messages().send()': function (done) {
    mailgun.messages().send(fixture.message, function (err, body) {
      assert.ifError(err);
      assert.ok(body.id);
      assert.ok(body.message);
      assert(/Queued. Thank you./.test(body.message));
      done();
    });
  },

  'test messages().send() with invalid attachment should go ok': function (done) {
    var msg = fixture.message;
    msg.attachment = 123;

    mailgun.messages().send(msg, function (err, body) {
      assert.ifError(err);
      assert.ok(body.id);
      assert.ok(body.message);
      assert(/Queued. Thank you./.test(body.message));
      done();
    });
  },

  'test messages().send() with attachment using filename': function (done) {
    var msg = fixture.message;
    var filename = path.join(__dirname, '/mailgun_logo.png');
    msg.attachment = filename;

    mailgun.messages().send(msg, function (err, body) {
      assert.ifError(err);
      assert.ok(body.id);
      assert.ok(body.message);
      assert(/Queued. Thank you./.test(body.message));
      done();
    });
  },

  'test messages().send() with attachment using file buffer': function (done) {
    var msg = fixture.message;

    var filename = path.join(__dirname, '/mailgun_logo.png');
    var file = fs.readFileSync(filename);

    msg.attachment = file;

    mailgun.messages().send(msg, function (err, body) {
      assert.ifError(err);
      assert.ok(body.id);
      assert.ok(body.message);
      assert(/Queued. Thank you./.test(body.message));
      done();
    });
  },

  'test messages().send() with attachment using Attachment object': function (done) {
    var msg = fixture.message;

    var filename = '/mailgun_logo.png';
    var filepath = path.join(__dirname, filename);
    var file = fs.readFileSync(filepath);

    msg.attachment = new Mailgun.Attachment(file, filename);

    mailgun.messages().send(msg, function (err, body) {
      assert.ifError(err);
      assert.ok(body.id);
      assert.ok(body.message);
      assert(/Queued. Thank you./.test(body.message));
      done();
    });
  },

  'test messages().send() with multiple attachments': function (done) {
    var msg = fixture.message;
    var filename = path.join(__dirname, '/fixture.json');
    var filename2 = path.join(__dirname, '/mailgun_logo.png');
    var file = fs.readFileSync(filename2);

    msg.attachment = [filename, file];

    mailgun.messages().send(msg, function (err, body) {
      assert.ifError(err);
      assert.ok(body.id);
      assert.ok(body.message);
      assert(/Queued. Thank you./.test(body.message));
      done();
    });
  },

  'test messages().send() with invalid inline attachment should go ok': function (done) {
    var msg = fixture.message;
    msg.inline = 123;

    mailgun.messages().send(msg, function (err, body) {
      assert.ifError(err);
      assert.ok(body.id);
      assert.ok(body.message);
      assert(/Queued. Thank you./.test(body.message));
      done();
    });
  },

  'test messages().send() with inline attachment using filename': function (done) {
    var msg = fixture.message;
    var filename = path.join(__dirname, '/mailgun_logo.png');

    msg.inline = filename;

    mailgun.messages().send(msg, function (err, body) {
      assert.ifError(err);
      assert.ok(body.id);
      assert.ok(body.message);
      assert(/Queued. Thank you./.test(body.message));
      done();
    });
  },

  'test messages().send() with inline attachment using file buffer': function (done) {
    var msg = fixture.message;

    var filename = path.join(__dirname, '/mailgun_logo.png');
    var file = fs.readFileSync(filename);

    msg.inline = file;

    mailgun.messages().send(msg, function (err, body) {
      assert.ifError(err);
      assert.ok(body.id);
      assert.ok(body.message);
      assert(/Queued. Thank you./.test(body.message));
      done();
    });
  },

  'test messages().send() with attachment using Attachment object': function (done) {
    var msg = fixture.message;

    var filename = '/mailgun_logo.png';
    var filepath = path.join(__dirname, filename);
    var file = fs.readFileSync(filepath);

    msg.inline = new Mailgun.Attachment(file, filename);

    mailgun.messages().send(msg, function (err, body) {
      assert.ifError(err);
      assert.ok(body.id);
      assert.ok(body.message);
      assert(/Queued. Thank you./.test(body.message));
      done();
    });
  },

  'test messages().send() with multiple inline attachments': function (done) {
    var msg = fixture.message;
    var filename = path.join(__dirname, '/fixture.json');
    var filename2 = path.join(__dirname, '/mailgun_logo.png');
    var file = fs.readFileSync(filename2);

    msg.inline = [filename, file];

    mailgun.messages().send(msg, function (err, body) {
      assert.ifError(err);
      assert.ok(body.id);
      assert.ok(body.message);
      assert(/Queued. Thank you./.test(body.message));
      done();
    });
  },

  'test messages().send() with multiple inline and normal attachments': function (done) {
    var msg = fixture.message;
    var filename = path.join(__dirname, '/fixture.json');
    var filename2 = path.join(__dirname, '/mailgun_logo.png');

    msg.attachment = filename;
    msg.inline = filename2;

    mailgun.messages().send(msg, function (err, body) {
      assert.ifError(err);
      assert.ok(body.id);
      assert.ok(body.message);
      assert(/Queued. Thank you./.test(body.message));
      done();
    });
  },

  /*
   * Domains
   */

  'test domains().create() invalid missing address': function (done) {
    mailgun.domains().create({}, function (err, body) {
      assert.ok(err);
      assert(/Missing parameter 'name'/.test(err.message));
      done();
    });
  },

  'test domains().create() invalid missing smtp password': function (done) {
    mailgun.domains().create({ name: fixture.new_domain.name }, function (err, body) {
      assert.ok(err);
      assert(/Missing parameter 'smtp_password'/.test(err.message));
      done();
    });
  },

  'test domains().create() ': function (done) {
    mailgun.domains().create(fixture.new_domain, function (err, body) {
      assert.ifError(err);
      assert.ok(body.message);
      assert(/Domain has been created/.test(body.message));
      assert.ok(body.domain);
      assert.equal(fixture.new_domain.name, body.domain.name);
      assert.equal(fixture.new_domain.smtp_password, body.domain.smtp_password);
      done();
    });
  },

  'test domains().list()': function (done) {
    mailgun.domains().list(function (err, body) {
      assert.ifError(err);
      assert.ok(body.total_count);
      assert.ok(body.items);
      done();
    });
  },

  'test domains().info()': function (done) {
    mailgun.domains(fixture.existing_domain.name).info(function (err, body) {
      assert.ifError(err);
      assert.ok(body.domain);
      assert.equal(fixture.existing_domain.name, body.domain.name);
      done();
    });
  },

  'test domains().credentials().list()': function (done) {
    mailgun.domains(fixture.existing_domain.name).credentials().list(function (err, body) {
      assert.ifError(err);
      assert.ok(body.total_count);
      assert.ok(body.items);
      done();
    });
  },

  'test domains().credentials().create() missing login': function (done) {
    mailgun.domains(fixture.existing_domain.name).credentials().create({}, function (err, body) {
      assert.ok(err);
      assert(/Missing parameter 'login'/.test(err.message));
      done();
    });
  },

  'test domains().credentials().create() missing password': function (done) {
    mailgun.domains(fixture.existing_domain.name).credentials().create({ login: fixture.credentials.login }, function (err, body) {
      assert.ok(err);
      assert(/Missing parameter 'password'/.test(err.message));
      done();
    });
  },

  'test domains().credentials().create() invalid login type': function (done) {
    mailgun.domains(fixture.existing_domain.name).credentials().create({ login: 123, password: 'test' }, function (err, body) {
      assert.ok(err);
      assert(/Invalid parameter type./.test(err.message));
      done();
    });
  },

  'test domains().credentials().create() invalid password type': function (done) {
    mailgun.domains(fixture.existing_domain.name).credentials().create({ login: fixture.credentials.login, password: 123 }, function (err, body) {
      assert.ok(err);
      assert(/Invalid parameter type./.test(err.message));
      done();
    });
  },

  'test domains().credentials().create()': function (done) {
    mailgun.domains(fixture.existing_domain.name).credentials().create({ login: fixture.credentials.login, password: fixture.credentials.password }, function (err, body) {
      assert.ifError(err);
      assert.ok(body.message);
      done();
    });
  },

  'test domains().credentials().update() missing password': function (done) {
    mailgun.domains(fixture.existing_domain.name).credentials(fixture.credentials.login).update({}, function (err, body) {
      assert.ok(err);
      assert(/Missing parameter 'password'/.test(err.message));
      done();
    });
  },

  'test domains().credentials().update() invalid password type': function (done) {
    mailgun.domains(fixture.existing_domain.name).credentials(fixture.credentials.login).update({ password: 123 }, function (err, body) {
      assert.ok(err);
      assert(/Invalid parameter type./.test(err.message));
      done();
    });
  },

  'test domains().credentials().update()': function (done) {
    mailgun.domains(fixture.existing_domain.name).credentials(fixture.credentials.login).update({ password: fixture.credentials.password }, function (err, body) {
      assert.ifError(err);
      assert.ok(body.message);
      done();
    });
  },

  'test domains().credentials().delete()': function (done) {
    mailgun.domains(fixture.existing_domain.name).credentials(fixture.credentials.login).delete(function (err, body) {
      assert.ifError(err);
      assert.ok(body.message);
      done();
    });
  },

  'test domains().delete()': function (done) {
    var domain = fixture.new_domain.name;
    mailgun.domains(domain).delete(function (err, body) {
      assert.ifError(err);
      assert.ok(body.message);
      assert(/Domain has been deleted/.test(body.message));
      done();
    });
  },

  /*
   * Unsubscribes
   */

  'test unsubscribes().create() missing address': function (done) {
    mailgun.unsubscribes().create({}, function (err, body) {
      assert.ok(err);
      assert(/Missing parameter 'address'/.test(err.message));
      done();
    });
  },

  'test unsubscribes().create() missing tag': function (done) {
    mailgun.unsubscribes().create({address: fixture.unsubscribe.address}, function (err, body) {
      assert.ok(err);
      assert(/Missing parameter 'tag'/.test(err.message));
      done();
    });
  },

  'test unsubscribes().create() invalid address type': function (done) {
    mailgun.unsubscribes().create({address: 123, tag: fixture.unsubscribe.tag}, function (err, body) {
      assert.ok(err);
      assert(/Invalid parameter type./.test(err.message));
      done();
    });
  },

  'test unsubscribes().create() invalid tag type': function (done) {
    mailgun.unsubscribes().create({address: fixture.unsubscribe.address, tag: 10}, function (err, body) {
      assert.ok(err);
      assert(/Invalid parameter type./.test(err.message));
      done();
    });
  },

  'test unsubscribes().create()': function (done) {
    mailgun.unsubscribes().create(fixture.unsubscribe, function (err, body) {
      assert.ifError(err);
      assert.ok(body);
      done();
    });
  },

  'test unsubscribes().list()': function (done) {
    mailgun.unsubscribes().list(function (err, body) {
      assert.ifError(err);
      assert.ok(body.total_count);
      assert.ok(body.items);
      done();
    });
  },

  'test unsubscribes().info()': function (done) {
    mailgun.unsubscribes('me@test.com').info(function (err, body) {
      assert.ifError(err);
      assert.ok(body);
      done();
    });
  },

  'test unsubscribes().delete()': function (done) {
    mailgun.unsubscribes(fixture.unsubscribe.address).delete(function (err, body) {
      assert.ifError(err);
      assert.ok(body);
      done();
    });
  },

  /*
   * Bounces
   */

  'test bounces().create() missing address': function (done) {
    mailgun.bounces().create({}, function (err, body) {
      assert.ok(err);
      assert(/Missing parameter 'address'/.test(err.message));
      done();
    });
  },

  'test bounces().create() invalid address type': function (done) {
    mailgun.bounces().create({address: 123}, function (err, body) {
      assert.ok(err);
      assert(/Invalid parameter type./.test(err.message));
      done();
    });
  },

  'test bounces().create()': function (done) {
    mailgun.bounces().create(fixture.bounce, function (err, body) {
      assert.ifError(err);
      assert.ok(body);
      done();
    });
  },

  'test bounces().list()': function (done) {
    mailgun.bounces().list(function (err, body) {
      assert.ifError(err);
      assert.ok(body.total_count >= 0);
      assert.ok(body.items);
      done();
    });
  },

  'test bounces().info()': function (done) {
    mailgun.bounces(fixture.bounce.address).info(function (err, body) {
      assert.ifError(err);
      assert.ok(body);
      assert.ok(body.bounce.address);
      done();
    });
  },

  'test bounces().delete()': function (done) {
    mailgun.bounces(fixture.bounce.address).delete(function (err, body) {
      assert.ifError(err);
      assert.ok(body);
      done();
    });
  },

  /*
   * Routes
   */

  'test routes().create() invalid missing expression': function (done) {
    mailgun.routes().create({}, function (err, body) {
      assert.ok(err);
      assert(/Missing parameter 'expression'/.test(err.message));
      done();
    });
  },

  'test routes().create() invalid missing action': function (done) {
    mailgun.routes().create({expression: fixture.route.expression}, function (err, body) {
      assert.ok(err);
      assert(/Missing parameter 'action'/.test(err.message));
      done();
    });
  },

  'test routes().create()': function (done) {
    mailgun.routes().create(fixture.route, function (err, body) {
      assert.ifError(err);
      assert.ok(body);
      assert.ok(body.route);
      routeId = body.route.id;
      done();
    });
  },

  'test routes().list()': function (done) {
    mailgun.routes().list(function (err, body) {
      assert.ifError(err);
      assert.ok(body.total_count >= 0);
      assert.ok(body.items);
      done();
    });
  },

  'test routes().info()': function (done) {
    mailgun.routes(routeId).info(function (err, body) {
      assert.ifError(err);
      assert.ok(body.route);
      assert.equal(routeId, body.route.id);
      done();
    });
  },

  'test routes().update()': function (done) {
    mailgun.routes(routeId).update({
      description: 'test new route update',
      expression: 'match_recipient(".*@samples.mailgun.org")',
      action: 'forward("http://myhost.com/messages/")'
    }, function (err, body) {
      assert.ifError(err);
      assert.ok(body.message);
      assert.equal(routeId, body.id);
      done();
    });
  },

  'test routes().delete()': function (done) {
    mailgun.routes(routeId).delete(function (err, body) {
      assert.ifError(err);
      assert.ok(body.message);
      done();
    });
  },

  /*
   * Mailing lists
   */

  'test lists().create() invalid missing address': function (done) {
    mailgun.lists().create({}, function (err, body) {
      assert.ok(err);
      assert(/Missing parameter 'address'/.test(err.message));
      done();
    });
  },

  'test lists.create()': function (done) {
    mailgun.lists().create(fixture.mailingList, function (err, body) {
      assert.ifError(err);
      assert.ok(body.message);
      assert.ok(body.list);
      assert.equal(fixture.mailingList.address, body.list.address);
      assert.equal(fixture.mailingList.name, body.list.name);
      assert.equal(fixture.mailingList.description, body.list.description);
      done();
    });
  },

  'test lists.list()': function (done) {
    mailgun.lists().list(function (err, body) {
      assert.ifError(err);
      assert.ok(body.total_count);
      assert.ok(body.items);
      done();
    });
  },

  'test lists().info()': function (done) {
    mailgun.lists(fixture.mailingList.address).info(function (err, body) {
      assert.ifError(err);
      assert.ok(body.list);
      assert.ok(body.list.address);
      assert.ok(body.list.name);
      done();
    });
  },

  'test lists().update()': function (done) {
    var name = 'Test List Updated';
    var desc = 'My updated test mailing list';
    mailgun.lists(fixture.mailingList.address).update({ name: name, description: desc }, function (err, body) {
      assert.ifError(err);
      assert.ok(body.message);
      assert.equal(fixture.mailingList.address, body.list.address);
      assert.equal(name, body.list.name);
      assert.equal(desc, body.list.description);
      done();
    });
  },

  'test lists().members().create() no member address': function (done) {
    mailgun.lists(fixture.mailingList.address).members().create({}, function (err, body) {
      assert.ok(err);
      assert(/Missing parameter 'address'/.test(err.message));
      done();
    });
  },

  'test lists().members().create() invalid address type': function (done) {
    mailgun.lists(fixture.mailingList.address).members().create({address: 1234}, function (err, body) {
      assert.ok(err);
      assert(/Invalid parameter type./.test(err.message));
      done();
    });
  },

  'test lists().members().create()': function (done) {
    var data = {
      subscribed: true,
      address: 'bob@gmail.com',
      name: 'Bob Bar',
      vars: {age: 26}
    };

    mailgun.lists(fixture.mailingList.address).members().create(data, function (err, body) {
      assert.ifError(err);
      assert.ok(body.message);
      assert.ok(body.member);
      assert.ok(body.member.address);
      assert.ok(body.member.name);
      assert.ok(body.member.vars);
      assert.equal(data.subscribed, body.member.subscribed);
      assert.equal(data.address, body.member.address);
      assert.equal(data.name, body.member.name);
      assert.equal(data.vars.age, body.member.vars.age);
      done();
    });
  },

  'test lists().members().list()': function (done) {
    mailgun.lists(fixture.mailingList.address).members().list(function (err, body) {
      assert.ifError(err);
      assert.ok(body.total_count >= 0);
      assert.ok(body.items);
      done();
    });
  },

  'test lists.members().info()': function (done) {
    var data = {
      subscribed: true,
      address: 'bob@gmail.com',
      name: 'Bob Bar',
      vars: {age: 26}
    };

    mailgun.lists(fixture.mailingList.address).members('bob@gmail.com').info(function (err, body) {
      assert.ifError(err);
      assert.ok(body.member);
      assert.ok(body.member.vars);
      assert.equal(data.subscribed, body.member.subscribed);
      assert.equal(data.address, body.member.address);
      assert.equal(data.name, body.member.name);
      assert.equal(data.vars.age, body.member.vars.age);
      done();
    });
  },

  'test lists().members().update()': function (done) {
    var data = {
      subscribed: false,
      address: 'foo@gmail.com',
      name: 'Foo Bar',
      vars: {age: 36}
    };

    mailgun.lists(fixture.mailingList.address).members('bob@gmail.com').update(data, function (err, body) {
      assert.ifError(err);
      assert.ok(body.message);
      assert.ok(body.member);
      assert.ok(body.member.vars);
      assert.equal(data.subscribed, body.member.subscribed);
      assert.equal(data.address, body.member.address);
      assert.equal(data.name, body.member.name);
      assert.equal(data.vars.age, body.member.vars.age);
      done();
    });
  },

  'test lists().members().delete()': function (done) {
    var address = 'foo@gmail.com';
    mailgun.lists(fixture.mailingList.address).members(address).delete(function (err, body) {
      assert.ifError(err);
      assert.ok(body.message);
      done();
    });
  },

  'test lists().members().add() without subscribed': function (done) {
    var members = [
      {
        address: 'Alice <alice@example.com>',
        vars: { age: 26 }
      },
      {
        name: 'Bob',
        address: 'bob@example.com',
        vars: { age: 34 }
      }
    ];

    mailgun.lists(fixture.mailingList.address).members().add({ members: members }, function (err, body) {
      assert.ok(err);
      assert(/Missing parameter 'subscribed'/.test(err.message));
      done();
    });
  },

  'test lists().members().add()': function (done) {
    var members = [
      {
        address: 'Alice <alice@example.com>',
        vars: { age: 26 }
      },
      {
        name: 'Bob',
        address: 'bob@example.com',
        vars: { age: 34 }
      }
    ];

    mailgun.lists(fixture.mailingList.address).members().add({ members: members, subscribed: true }, function (err, body) {
      assert.ifError(err);
      assert.ok(body.list);
      assert.ok(body.list.members_count >= 0);
      done();
    });
  },

  'test lists().delete()': function (done) {
    mailgun.lists(fixture.mailingList.address).delete(function (err, body) {
      assert.ifError(err);
      assert.ok(body);
      assert.ok(body.message);
      done();
    });
  },

  'test stats': function (done) {
    mailgun.get('/stats', {event: 'sent' }, function (err, body) {
      assert.ifError(err);
      assert.ok(body);
      assert.ok(body.items);
      done();
    });
  }
};