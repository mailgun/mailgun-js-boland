# list

You can programmatically work with mailing lists and mailing list members using Mailgun Mailing List API.

## Actions

### `list`

Returns a list of mailing lists under your account.

`mailgun.lists().list({callback});`

Method | Path
--- | ---
GET | /lists

### `info`

Returns a single mailing list by a given address.

`mailgun.lists({address}).info({callback});`

Method | Path
--- | ---
GET | /lists/{address}

### `create`

Creates a new mailing list.

`mailgun.lists().create({attributes}, {callback});`

Method | Path
--- | ---
POST | /lists

### `update`

Update mailing list properties, such as address, description or name.

`mailgun.lists({address}).update({attributes}, {callback});`

Method | Path
--- | ---
PUT | /lists/{address}

### `delete`

Deletes a mailing list.

`mailgun.lists({address}).delete({callback});`

Method | Path
--- | ---
DELETE | /lists/{address}

