# bounces

Mailgun automatically handles bounced emails. The list of bounced addresses can be accessed programmatically.

## Actions

### `list`

Fetches the list of bounces.

`mailgun.bounces().list({callback});`

Method | Path
--- | ---
GET | /{domain}/bounces

### `info`

Fetches a single bounce event by a given email address.

`mailgun.bounces({address}).info({callback});`

Method | Path
--- | ---
GET | /{domain}/bounces/{address}

### `delete`

Clears a given bounce event.

`mailgun.bounces({address}).delete({callback});`

Method | Path
--- | ---
DELETE | /{domain}/bounces/{address}

### `create`

Adds a permanent bounce to the bounces table. Updates the existing record if already here.

`mailgun.bounces().create({attributes}, {callback});`

Method | Path
--- | ---
POST | /{domain}/bounces

