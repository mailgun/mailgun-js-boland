var auth = require('./auth.json');
var fixture = require('./fixture.json');
var clone = require('clone');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var mailcomposer = require("mailcomposer");
var request = require("request");

var mailgun = require('../lib/mailgun')({ apiKey: auth.api_key, domain: auth.domain });

var routeId = -1;

describe('mailgun-js', function () {
  beforeEach(function (done) {
    setTimeout(done, 500);
  });

  describe('Messages', function () {
    it('test messages.send() invalid "from"', function (done) {
      mailgun.messages().send({ to: fixture.message.to }, function (err, body) {
        assert.ok(err);
        assert(/Missing parameter 'from'/.test(err.message));
        done();
      });
    });

    it('test messages().send()', function (done) {
      var msg = clone(fixture.message);
      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with recipient vars', function (done) {
      var msg = clone(fixture.message_recipient_vars);
      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with invalid attachment should go ok', function (done) {
      var msg = clone(fixture.message);
      msg.attachment = 123;

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with attachment using filename', function (done) {
      var msg = clone(fixture.message);
      var filename = path.join(__dirname, '/mailgun_logo.png');
      msg.attachment = filename;

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with attachment using filename with important flag', function (done) {
      var msg = clone(fixture.message);
      msg.important = true;
      var filename = path.join(__dirname, '/mailgun_logo.png');
      msg.attachment = filename;

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with attachment using filename and undefined v: var', function (done) {
      var msg = clone(fixture.message);
      var filename = path.join(__dirname, '/mailgun_logo.png');
      msg.attachment = filename;

      msg['v:someFoo'] = undefined;

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with attachment using file buffer', function (done) {
      var msg = clone(fixture.message);

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
    });

    it('test messages().send() with attachment using Attachment object (Buffer)', function (done) {
      var msg = clone(fixture.message);

      var filename = '/mailgun_logo.png';
      var filepath = path.join(__dirname, filename);
      var file = fs.readFileSync(filepath);

      msg.attachment = new mailgun.Attachment({ data: file, filename: filename });

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with attachment using Attachment object (file)', function (done) {
      var msg = clone(fixture.message);

      var filename = '/mailgun_logo.png';
      var filepath = path.join(__dirname, filename);

      msg.attachment = new mailgun.Attachment({ data: filepath, filename: 'my_custom_name.png' });

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with multiple attachments', function (done) {
      var msg = clone(fixture.message);
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
    });

    it('test messages().send() with invalid inline attachment should go ok', function (done) {
      var msg = clone(fixture.message);
      msg.inline = 123;

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with inline attachment using filename', function (done) {
      var msg = clone(fixture.message);
      var filename = path.join(__dirname, '/mailgun_logo.png');

      msg.inline = filename;

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with inline attachment using file buffer', function (done) {
      var msg = clone(fixture.message);

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
    });

    it('test messages().send() with inline attachment using Attachment object (Buffer)', function (done) {
      var msg = clone(fixture.message);

      var filename = '/mailgun_logo.png';
      var filepath = path.join(__dirname, filename);
      var file = fs.readFileSync(filepath);

      msg.inline = new mailgun.Attachment({ data: file, filename: filename });

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with inline attachment using Attachment object (file)', function (done) {
      var msg = clone(fixture.message);

      var filename = '/mailgun_logo.png';
      var filepath = path.join(__dirname, filename);

      msg.inline = new mailgun.Attachment({ data: filepath, filename: 'my_custom_name.png' });

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with multiple inline attachments', function (done) {
      var msg = clone(fixture.message);
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
    });

    it('test messages().send() with multiple inline and normal attachments', function (done) {
      var msg = clone(fixture.message);
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
    });

    it('test messages().send() with multiple tags', function (done) {
      var msg = clone(fixture.message);

      msg['o:tag'] = ['tag1', 'tag2', 'tag3'];

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with multiple tags and normal attachment', function (done) {
      var msg = clone(fixture.message);
      var filename = path.join(__dirname, '/fixture.json');

      msg.attachment = filename;

      msg['o:tag'] = ['tag1', 'tag2', 'tag3'];

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with attachment using stream', function (done) {
      var msg = clone(fixture.message);

      var file = request("https://www.google.ca/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png");

      msg.attachment = file;

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with attachment using Attachment object (stream)', function (done) {
      var msg = clone(fixture.message);

      var filename = '/mailgun_logo.png';
      var filepath = path.join(__dirname, filename);
      var fileStream = fs.createReadStream(filepath);
      var fileStat = fs.statSync(filepath);

      msg.attachment = new mailgun.Attachment({
        data: fileStream,
        filename: 'my_custom_name.png',
        knownLength: fileStat.size,
        contentType: 'image/png'
      });

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with custom data', function (done) {
      var msg = clone(fixture.message);

      msg['v:whatever'] = 123;
      msg['v:test'] = true;

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test messages().send() with custom data as object', function (done) {
      var msg = clone(fixture.message);

      msg['v:my-custom-data'] = { whatever: 123, test: true };

      mailgun.messages().send(msg, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });
  });

  describe('Domains', function () {
    it('test domains().create() invalid missing address', function (done) {
      mailgun.domains().create({}, function (err, body) {
        assert.ok(err);
        assert(/Missing parameter 'name'/.test(err.message));
        done();
      });
    });

    it('test domains().create() invalid missing smtp password', function (done) {
      mailgun.domains().create({ name: fixture.new_domain.name }, function (err, body) {
        assert.ok(err);
        assert(/Missing parameter 'smtp_password'/.test(err.message));
        done();
      });
    });

    it.skip('test domains().create() ', function (done) {
      // mailgun.domains().create(fixture.new_domain, function (err, body) {
      //   assert.ifError(err);
      //   assert.ok(body.message);
      //   assert(/Domain has been created/.test(body.message));
      //   assert.ok(body.domain);
      //   assert.equal(fixture.new_domain.name, body.domain.name);
      //   assert.equal(fixture.new_domain.smtp_password, body.domain.smtp_password);
      //   done();
      // });
    });

    it('test domains().list()', function (done) {
      mailgun.domains().list(function (err, body) {
        assert.ifError(err);
        assert.ok(body.total_count);
        assert.ok(body.items);
        done();
      });
    });

    it('test domains().info()', function (done) {
      mailgun.domains(fixture.existing_domain.name).info(function (err, body) {
        assert.ifError(err);
        assert.ok(body.domain);
        assert.equal(fixture.existing_domain.name, body.domain.name);
        done();
      });
    });

    it('test domains().credentials().list()', function (done) {
      mailgun.domains(fixture.existing_domain.name).credentials().list(function (err, body) {
        assert.ifError(err);
        assert.ok(body.total_count);
        assert.ok(body.items);
        done();
      });
    });

    it('test domains().credentials().create() missing login', function (done) {
      mailgun.domains(fixture.existing_domain.name).credentials().create({}, function (err, body) {
        assert.ok(err);
        assert(/Missing parameter 'login'/.test(err.message));
        done();
      });
    });

    it('test domains().credentials().create() missing password', function (done) {
      mailgun.domains(fixture.existing_domain.name).credentials().create({ login: fixture.credentials.login }, function (err, body) {
        assert.ok(err);
        assert(/Missing parameter 'password'/.test(err.message));
        done();
      });
    });

    it('test domains().credentials().create() invalid login type', function (done) {
      mailgun.domains(fixture.existing_domain.name).credentials().create({
        login: 123,
        password: 'password'
      }, function (err, body) {
        assert.ok(err);
        assert(/Invalid parameter type./.test(err.message));
        done();
      });
    });

    it('test domains().credentials().create() invalid password type', function (done) {
      mailgun.domains(fixture.existing_domain.name).credentials().create({
        login: fixture.credentials.login,
        password: 123
      }, function (err, body) {
        assert.ok(err);
        assert(/Invalid parameter type./.test(err.message));
        done();
      });
    });

    it('test domains().credentials().create()', function (done) {
      mailgun.domains(fixture.existing_domain.name).credentials().create({
        login: fixture.credentials.login,
        password: fixture.credentials.password
      }, function (err, body) {
        assert.ifError(err);
        assert.ok(body.message);
        done();
      });
    });

    it('test domains().credentials().update() missing password', function (done) {
      mailgun.domains(fixture.existing_domain.name).credentials(fixture.credentials.login).update({}, function (err, body) {
        assert.ok(err);
        assert(/Missing parameter 'password'/.test(err.message));
        done();
      });
    });

    it('test domains().credentials().update() invalid password type', function (done) {
      mailgun.domains(fixture.existing_domain.name).credentials(fixture.credentials.login).update({ password: 123 }, function (err, body) {
        assert.ok(err);
        assert(/Invalid parameter type./.test(err.message));
        done();
      });
    });

    it('test domains().credentials().update()', function (done) {
      mailgun.domains(fixture.existing_domain.name).credentials(fixture.credentials.login).update({ password: fixture.credentials.password }, function (err, body) {
        assert.ifError(err);
        assert.ok(body.message);
        done();
      });
    });

    it('test domains().credentials().delete()', function (done) {
      mailgun.domains(fixture.existing_domain.name).credentials(fixture.credentials.login).delete(function (err, body) {
        assert.ifError(err);
        assert.ok(body.message);
        done();
      });
    });

    it.skip('test domains().delete()', function (done) {
      // var domain = fixture.new_domain.name;
      // mailgun.domains(domain).delete(function (err, body) {
      //   assert.ifError(err);
      //   assert.ok(body.message);
      //   assert(/Domain has been deleted/.test(body.message));
      //   done();
      // });
    });

    it('test domains().verify() that it is a function', function () {
      // we can't actally just call this endpoint
      var fn = mailgun.domains(fixture.existing_domain.name).verify;
      assert.ok(typeof fn === 'function');
    });
  });

  describe('Unsubscribes', function () {
    it('test unsubscribes().create() missing address', function (done) {
      mailgun.unsubscribes().create({}, function (err, body) {
        assert.ok(err);
        assert(/Missing parameter 'address'/.test(err.message));
        done();
      });
    });

    it('test unsubscribes().create() missing tag', function (done) {
      mailgun.unsubscribes().create({ address: fixture.unsubscribe.address }, function (err, body) {
        assert.ok(err);
        assert(/Missing parameter 'tag'/.test(err.message));
        done();
      });
    });

    it('test unsubscribes().create() invalid address type', function (done) {
      mailgun.unsubscribes().create({ address: 123, tag: fixture.unsubscribe.tag }, function (err, body) {
        assert.ok(err);
        assert(/Invalid parameter type./.test(err.message));
        done();
      });
    });

    it('test unsubscribes().create() invalid tag type', function (done) {
      mailgun.unsubscribes().create({ address: fixture.unsubscribe.address, tag: 10 }, function (err, body) {
        assert.ok(err);
        assert(/Invalid parameter type./.test(err.message));
        done();
      });
    });

    it('test unsubscribes().create()', function (done) {
      mailgun.unsubscribes().create(fixture.unsubscribe, function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        done();
      });
    });

    it('test unsubscribes().list()', function (done) {
      mailgun.unsubscribes().list(function (err, body) {
        assert.ifError(err);
        assert.ok(body.items);
        done();
      });
    });

    it('test unsubscribes().info()', function (done) {
      mailgun.unsubscribes(fixture.unsubscribe.address).info(function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        done();
      });
    });

    it('test unsubscribes().delete()', function (done) {
      mailgun.unsubscribes(fixture.unsubscribe.address).delete(function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        done();
      });
    });
  });

  describe('Bounces', function () {
    it('test bounces().create() missing address', function (done) {
      mailgun.bounces().create({}, function (err, body) {
        assert.ok(err);
        assert(/Missing parameter 'address'/.test(err.message));
        done();
      });
    });

    it('test bounces().create() invalid address type', function (done) {
      mailgun.bounces().create({ address: 123 }, function (err, body) {
        assert.ok(err);
        assert(/Invalid parameter type./.test(err.message));
        done();
      });
    });

    it('test bounces().create()', function (done) {
      mailgun.bounces().create(fixture.bounce, function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        done();
      });
    });

    it('test bounces().list()', function (done) {
      mailgun.bounces().list(function (err, body) {
        assert.ifError(err);
        assert.ok(body.items);
        done();
      });
    });

    it('test bounces().info()', function (done) {
      mailgun.bounces(fixture.bounce.address).info(function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        assert.ok(body.address);
        done();
      });
    });

    it('test bounces().delete()', function (done) {
      mailgun.bounces(fixture.bounce.address).delete(function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        done();
      });
    });
  });

  describe('Routes', function () {
    it('test routes().create() invalid missing expression', function (done) {
      mailgun.routes().create({}, function (err, body) {
        assert.ok(err);
        assert(/Missing parameter 'expression'/.test(err.message));
        done();
      });
    });

    it('test routes().create()', function (done) {
      mailgun.routes().create(fixture.route, function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        assert.ok(body.route);
        routeId = body.route.id;
        done();
      });
    });

    it('test routes().list()', function (done) {
      mailgun.routes().list(function (err, body) {
        assert.ifError(err);
        assert.ok(body.total_count >= 0);
        assert.ok(body.items);
        done();
      });
    });

    it('test routes().info()', function (done) {
      mailgun.routes(routeId).info(function (err, body) {
        assert.ifError(err);
        assert.ok(body.route);
        assert.equal(routeId, body.route.id);
        done();
      });
    });

    it('test routes().update() with one action argument', function (done) {
      mailgun.routes(routeId).update({
        description: 'new route update',
        expression: 'match_recipient(".*@samples.mailgun.org")',
        action: 'forward("http://myhost.com/messages/")'
      }, function (err, body) {
        assert.ifError(err);
        assert.ok(body.message);
        assert.equal(routeId, body.id);
        done();
      });
    });

    it('test routes().update() with two action arguments', function (done) {
      mailgun.routes(routeId).update({
        description: 'test new route update',
        expression: 'match_recipient(".*@samples.mailgun.org")',
        action: ['forward("http://myhost.com/messages/")', 'stop()']
      }, function (err, body) {
        assert.ifError(err);
        assert.ok(body.message);
        assert.equal(routeId, body.id);
        done();
      });
    });

    it('test routes().delete()', function (done) {
      mailgun.routes(routeId).delete(function (err, body) {
        assert.ifError(err);
        assert.ok(body.message);
        done();
      });
    });
  });

  describe('Mailing lists', function () {
    it('test lists().create() invalid missing address', function (done) {
      mailgun.lists().create({}, function (err, body) {
        assert.ok(err);
        assert(/Missing parameter 'address'/.test(err.message));
        done();
      });
    });

    it('test lists.create()', function (done) {
      mailgun.lists().create(fixture.mailingList, function (err, body) {
        assert.ifError(err);
        assert.ok(body.message);
        assert.ok(body.list);
        assert.equal(fixture.mailingList.address, body.list.address);
        assert.equal(fixture.mailingList.name, body.list.name);
        assert.equal(fixture.mailingList.description, body.list.description);
        done();
      });
    });

    it('test lists.list()', function (done) {
      mailgun.lists().list(function (err, body) {
        assert.ifError(err);
        assert.ok(body.total_count);
        assert.ok(body.items);
        done();
      });
    });

    it('test lists().info()', function (done) {
      mailgun.lists(fixture.mailingList.address).info(function (err, body) {
        assert.ifError(err);
        assert.ok(body.list);
        assert.ok(body.list.address);
        assert.ok(body.list.name);
        done();
      });
    });

    it('test lists().update()', function (done) {
      var name = 'List Updated';
      var desc = 'My updated test mailing list';
      mailgun.lists(fixture.mailingList.address).update({ name: name, description: desc }, function (err, body) {
        assert.ifError(err);
        assert.ok(body.message);
        assert.equal(fixture.mailingList.address, body.list.address);
        assert.equal(name, body.list.name);
        assert.equal(desc, body.list.description);
        done();
      });
    });

    it('test lists().members().create() no member address', function (done) {
      mailgun.lists(fixture.mailingList.address).members().create({}, function (err, body) {
        assert.ok(err);
        assert(/Missing parameter 'address'/.test(err.message));
        done();
      });
    });

    it('test lists().members().create() invalid address type', function (done) {
      mailgun.lists(fixture.mailingList.address).members().create({ address: 1234 }, function (err, body) {
        assert.ok(err);
        assert(/Invalid parameter type./.test(err.message));
        done();
      });
    });

    it('test lists().members().create()', function (done) {
      var data = {
        subscribed: true,
        address: 'bob@gmail.com',
        name: 'Bob Bar',
        vars: { age: 26 }
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
    });

    it('test lists().members().list()', function (done) {
      mailgun.lists(fixture.mailingList.address).members().list(function (err, body) {
        assert.ifError(err);
        assert.ok(body.total_count >= 0);
        assert.ok(body.items);
        done();
      });
    });

    it('test lists().members().pages().page()', function (done) {
      mailgun.lists(fixture.mailingList.address).members().pages().page({ page: 'first' }, function (err, body) {
        assert.ifError(err);
        assert.ok(Array.isArray(body.items));
        assert.ok(typeof body.paging === 'object');
        done();
      });
    });

    it('test lists.members().info()', function (done) {
      var data = {
        subscribed: true,
        address: 'bob@gmail.com',
        name: 'Bob Bar',
        vars: { age: 26 }
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
    });

    it('test lists().members().update()', function (done) {
      var data = {
        subscribed: false,
        address: 'foo@gmail.com',
        name: 'Foo Bar',
        vars: { age: 36 }
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
    });

    it('test lists().members().delete()', function (done) {
      var address = 'foo@gmail.com';
      mailgun.lists(fixture.mailingList.address).members(address).delete(function (err, body) {
        assert.ifError(err);
        assert.ok(body.message);
        done();
      });
    });

    it('test lists().members().add() without upsert', function (done) {
      var members = [{
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
        assert.ifError(err);
        assert.ok(body.list);
        assert.ok(body.list.members_count >= 0);
        done();
      });
    });

    it('test lists().members().add()', function (done) {
      var members = [{
          address: 'Alice <alice@example.com>',
          vars: { age: 26 }
        },
        {
          name: 'Bob',
          address: 'bob@example.com',
          vars: { age: 34 }
        }
      ];

      mailgun.lists(fixture.mailingList.address).members().add({
        members: members,
        upsert: true
      }, function (err, body) {
        assert.ifError(err);
        assert.ok(body.list);
        assert.ok(body.list.members_count >= 0);
        done();
      });
    });

    it('test lists().delete()', function (done) {
      mailgun.lists(fixture.mailingList.address).delete(function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        assert.ok(body.message);
        done();
      });
    });
  });

  describe('Campaigns', function () {
    it('test campaigns().create() invalid missing address', function (done) {
      mailgun.campaigns().create({}, function (err) {
        assert.ok(err);
        assert(/Missing parameter 'name'/.test(err.message));
        done();
      });
    });

    it('test campaigns().create()', function (done) {
      mailgun.campaigns().create(fixture.campaign, function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        // assert.ok(body.message);
        // assert.ok(body.campaign);
        // assert.equal(fixture.campaign.name, body.campaign.name);
        // assert.equal(fixture.campaign.id, body.campaign.id);
        done();
      });
    });


    it('test campaigns().list() with invalid `limit` param', function (done) {
      mailgun.campaigns().list({ limit: "foo" }, function (err, body) {
        assert.ok(err);
        assert(/Invalid parameter type./.test(err.message));
        done();
      });
    });

    it('test campaigns().list() with invalid `skip` param', function (done) {
      mailgun.campaigns().list({ skip: "bar" }, function (err, body) {
        assert.ok(err);
        assert(/Invalid parameter type./.test(err.message));
        done();
      });
    });

    it('test campaigns().list()', function (done) {
      mailgun.campaigns().list(function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        assert.ok(body.total_count);
        assert.ok(body.items);
        done();
      });
    });

    it('test campaigns().info()', function (done) {
      mailgun.campaigns(fixture.campaign.id).info(function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        assert.equal(fixture.campaign.id, body.id);
        assert.equal(fixture.campaign.name, body.name);
        done();
      });
    });

    it('test campaigns().update()', function (done) {
      mailgun.campaigns(fixture.campaign.id).update({ name: fixture.campaign.newName }, function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        assert.ok(body.message);
        assert.ok(body.campaign);
        assert.equal(fixture.campaign.newName, body.campaign.name);
        done();
      });
    });

    it('test campaigns().delete()', function (done) {
      mailgun.campaigns(fixture.campaign.id).delete(function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        assert.ok(body.message);
        done();
      });
    });
  });

  describe('Stats', function () {
    it('test mailgun.stats().list()', function (done) {
      mailgun.stats().list(function (err, body) {
        assert.ifError(err);
        assert.ok(body.total_count);
        assert.ok(body.items);
        done();
      });
    });

    it('test mailgun.stats().list() with one argument', function (done) {
      mailgun.stats().list({ event: 'delivered' }, function (err, body) {
        assert.ifError(err);
        assert.ok(body.total_count);
        assert.ok(body.items);
        done();
      });
    });

    it('test mailgun.stats().list() with arguments', function (done) {
      mailgun.stats().list({ event: ['sent', 'delivered'] }, function (err, body) {
        assert.ifError(err);
        assert.ok(body.total_count);
        assert.ok(body.items);
        done();
      });
    });
  });

  describe('Tags', function () {
    it('test mailgun.tags().list()', function (done) {
      mailgun.tags().list(function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        done();
      });
    });

    it('test mailgun.tags().info()', function (done) {
      mailgun.tags('tag1').info(function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        done();
      });
    });

    it('test mailgun.tags().delete()', function (done) {
      mailgun.tags('tag1').delete(function (err, body) {
        assert.ifError(err);
        assert.ok(body.message);
        done();
      });
    });
  });

  describe('Events', function () {
    it('test mailgun.events().get() simple recipient query', function (done) {
      var query = {
        begin: 'Fri, 3 May 2013 09:00:00 -0000',
        ascending: 'yes',
        limit: 25,
        pretty: 'yes',
        recipient: 'mm@samples.mailgun.org'
      };

      mailgun.events().get(query, function (err, body) {
        assert.ifError(err);
        assert.ok(body.items);
        done();
      });
    });

    it('test mailgun.events().get() simple event query', function (done) {
      var query = {
        event: 'rejected OR failed'
      };

      mailgun.events().get(query, function (err, body) {
        assert.ifError(err);
        assert.ok(body.items);
        done();
      });
    });

    it('test mailgun.events().get() without any params', function (done) {
      mailgun.events().get(function (err, body) {
        assert.ifError(err);
        assert.ok(body.items);
        done();
      });
    });
  });

  describe('Generic requests functions', function () {
    it('test mailgun.get()', function (done) {
      var path = '/' + auth.domain + '/stats';
      mailgun.get(path, { event: ['sent', 'delivered'] }, function (err, body) {
        assert.ifError(err);
        assert.ok(body.total_count);
        assert.ok(body.items);
        done();
      });
    });

    it('test mailgun.get() using promises', function (done) {
      var path = '/' + auth.domain + '/stats';
      mailgun.get(path, { event: ['sent', 'delivered'] }).then(function (body) {
        assert.ok(body.total_count);
        assert.ok(body.items);
        done();
      }).catch(function (err) {
        assert.ifError(err);
        done()
      });
    });

    it('test mailgun.get() using promises 2', function (done) {
      var mg = new mailgun.Mailgun({ apiKey: auth.public_api_key, domain: auth.domain })
      mg.get('/address/validate', { address: 'emailtestmg@gmail.com' }).then(body => {
        assert.ok(body);
        done();
      }).catch(err => {
        assert.ifError(err);
        done()
      });
    });
  });

  describe('Constructor', function () {
    it('instance constructor', function () {
      var mg = new mailgun.Mailgun({ apiKey: auth.api_key, domain: auth.domain });
      assert.ok(mg);
      assert.ok(mg instanceof mailgun.Mailgun);
      assert.ok(mg instanceof mg.Mailgun);
    });
  });

  describe('Send MIME', function () {
    it('test sendMime()', function (done) {
      var mail = mailcomposer({
        from: fixture.message.from,
        to: fixture.message.to,
        subject: fixture.message.subject,
        body: fixture.message.text,
        html: '<b>' + fixture.message.text + '</b>'
      });

      mail.build(function (err, message) {
        var data = {
          to: fixture.message.to,
          message: message.toString('ascii')
        };

        mailgun.messages().sendMime(data, function (err, body) {
          assert.ifError(err);
          assert.ok(body.id);
          assert.ok(body.message);
          assert(/Queued. Thank you./.test(body.message));
          done();
        });
      });
    });

    it('test sendMime() with to field as array', function (done) {
      var mail = mailcomposer({
        from: fixture.message.from,
        to: fixture.message.to,
        subject: fixture.message.subject,
        body: fixture.message.text,
        html: '<b>' + fixture.message.text + '</b>'
      });

      mail.build(function (err, message) {
        var data = {
          to: fixture.message_recipient_vars.to,
          message: message.toString('ascii')
        };

        mailgun.messages().sendMime(data, function (err, body) {
          assert.ifError(err);
          assert.ok(body.id);
          assert.ok(body.message);
          assert(/Queued. Thank you./.test(body.message));
          done();
        });
      });
    });

    it('test sendMime() with file path', function (done) {
      var filePath = path.join(__dirname, '/message.eml');

      var data = {
        to: fixture.message.to,
        message: filePath
      };

      mailgun.messages().sendMime(data, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });

    it('test sendMime() with file stream', function (done) {
      var filePath = path.join(__dirname, '/message.eml');

      var data = {
        to: fixture.message.to,
        message: fs.createReadStream(filePath)
      };

      mailgun.messages().sendMime(data, function (err, body) {
        assert.ifError(err);
        assert.ok(body.id);
        assert.ok(body.message);
        assert(/Queued. Thank you./.test(body.message));
        done();
      });
    });
  });

  describe('Error status code', function () {
    it('server error should have status code', function (done) {
      mailgun.domains('domaintest@test123.com').info(function (err, body) {
        assert.ok(err);
        assert.ok(err.statusCode);
        assert.equal(404, err.statusCode);
        done();
      });
    });
  });

  describe('Retry', function () {
    if ('messages().send() should work with retry option', function (done) {
        var mg = new mailgun.Mailgun({
          apiKey: auth.api_key,
          domain: auth.domain,
          retry: 3
        });

        var msg = clone(fixture.message);
        mg.messages().send(msg, function (err, body) {
          assert.ifError(err);
          assert.ok(body.id);
          assert.ok(body.message);
          assert(/Queued. Thank you./.test(body.message));
          done();
        });
      });

    if ('messages().send() should retry when request fails', function (done) {
        process.env.DEBUG_MAILGUN_FORCE_RETRY = true;
        var mg = new mailgun.Mailgun({
          apiKey: auth.api_key,
          domain: auth.domain,
          retry: 3
        });

        var msg = clone(fixture.message);
        mg.messages().send(msg, function (err, body) {
          assert.ifError(err);
          assert.ok(body.id);
          assert.ok(body.message);
          assert(/Queued. Thank you./.test(body.message));
          done();
        });
      });
  });

  describe('Complaints', function () {
    it('test complaints().create() missing address', function (done) {
      mailgun.complaints().create({}, function (err, body) {
        assert.ok(err);
        assert(/Missing parameter 'address'/.test(err.message));
        done();
      });
    });

    it('test complaints().create()', function (done) {
      mailgun.complaints().create({
        address: fixture.complaints.address
      }, function (err, body) {
        assert.ifError(err);
        assert.ok(body.message);
        done();
      });
    });

    it('test complaints().list()', function (done) {
      mailgun.complaints().list(function (err, body) {
        assert.ifError(err);
        assert.ok(body.items);
        done();
      });
    });

    it('test complaints().info()', function (done) {
      mailgun.complaints(fixture.complaints.address).info(function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        done();
      });
    });

    it('test complaints().delete()', function (done) {
      mailgun.complaints(fixture.complaints.address).delete(function (err, body) {
        assert.ifError(err);
        assert.ok(body.message);
        done();
      });
    });
  });

  describe('Email Validation', function () {
    it('test mailgun.validate() should validate one email address', function (done) {
      var mg = new mailgun.Mailgun({ apiKey: auth.api_key, publicApiKey: auth.public_api_key, domain: auth.domain })
      mg.validate('raboof@gmail.com', function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        done();
      });
    });

    it('test mailgun.validate() should validate one email address using private option', function (done) {
      var mg = new mailgun.Mailgun({ apiKey: auth.api_key, publicApiKey: auth.public_api_key, domain: auth.domain })
      mg.validate('raboof@gmail.com', true, function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        done();
      });
    });

    it('test mailgun.parse() should parse list of email addresses', function (done) {
      var mg = new mailgun.Mailgun({ apiKey: auth.api_key, publicApiKey: auth.public_api_key, domain: auth.domain })
      mg.parse(['raboof@gmail.com'], function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        done();
      });
    });

    it('test mailgun.parse() should parse list of email addresses with an option', function (done) {
      var mg = new mailgun.Mailgun({ apiKey: auth.api_key, publicApiKey: auth.public_api_key, domain: auth.domain })
      mg.parse(['raboof@gmail.com'], { syntax_only: false }, function (err, body) {
        console.dir(body, { depth: 3, colors: true })
        assert.ifError(err);
        assert.ok(body);
        done();
      });
    });

    it('test mailgun.parse() should private parse list of email addresses with an option', function (done) {
      var mg = new mailgun.Mailgun({ apiKey: auth.api_key, publicApiKey: auth.public_api_key, domain: auth.domain })
      mg.parse(['raboof@gmail.com'], true, { syntax_only: false }, function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        done();
      });
    });

    it('test mailgun.parse() should parse list of email addresses using private option', function (done) {
      var mg = new mailgun.Mailgun({ apiKey: auth.api_key, publicApiKey: auth.public_api_key, domain: auth.domain })
      mg.parse(['raboof@gmail.com'], true, function (err, body) {
        assert.ifError(err);
        assert.ok(body);
        done();
      });
    });
  });
});
