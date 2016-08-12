# credentials

Programmatically get and modify domain credentials.

## Actions

### `list`

Returns a list of SMTP credentials for the defined domain.

`mailgun.domains({domain}).credentials().list({callback});`

Method | Path
--- | ---
GET | /domains/{domain}/credentials

### `create`

Creates a new set of SMTP credentials for the defined domain.

`mailgun.domains({domain}).credentials().create({attributes}, {callback});`

Method | Path
--- | ---
POST | /domains/{domain}/credentials

### `update`

Updates the specified SMTP credentials. Currently only the password can be changed.

`mailgun.domains({domain}).credentials({login}).update({attributes}, {callback});`

Method | Path
--- | ---
PUT | /domains/{domain}/credentials/{login}

### `delete`

Deletes the defined SMTP credentials.

`mailgun.domains({domain}).credentials({login}).delete({callback});`

Method | Path
--- | ---
DELETE | /domains/{domain}/credentials/{login}

