# members

Programatically work with mailing lists members.

## Actions

### `list`

Fetches the list of mailing list members.

`mailgun.lists({address}).members().list({callback});`

Method | Path
--- | ---
GET | /lists/{address}/members

### `info`

Retrieves a mailing list member.

`mailgun.lists({address}).members({member_address}).info({callback});`

Method | Path
--- | ---
GET | /lists/{address}/members/{member_address}

### `create`

Adds a member to the mailing list.

`mailgun.lists({address}).members().create({attributes}, {callback});`

Method | Path
--- | ---
POST | /lists/{address}/members

### `add`

Adds multiple members, up to 1,000 per call, to a Mailing List.

`mailgun.lists({address}).members.json().add({attributes}, {callback});`

Method | Path
--- | ---
POST | /lists/{address}/members.json

### `update`

Updates a mailing list member with given properties.

`mailgun.lists({address}).members({member_address}).update({attributes}, {callback});`

Method | Path
--- | ---
PUT | /lists/{address}/members/{member_address}

### `delete`

Delete a mailing list member.

`mailgun.lists({address}).members({member_address}).delete({callback});`

Method | Path
--- | ---
DELETE | /lists/{address}/members/{member_address}

