# complaints

This API allows you to programmatically download the list of users who have complained, add a complaint, or delete a complaint.

## Actions

### `list`

Fetches the list of complaints.

`mailgun.complaints().list({callback});`

Method | Path
--- | ---
GET | /{domain}/complaints

### `create`

Adds an address to the complaints table.

`mailgun.complaints().create({attributes}, {callback});`

Method | Path
--- | ---
POST | /{domain}/complaints

### `info`

Fetches a single spam complaint by a given email address.

`mailgun.complaints({address}).info({callback});`

Method | Path
--- | ---
GET | /{domain}/complaints/{address}

### `delete`

Removes a given spam complaint.

`mailgun.complaints({address}).delete({callback});`

Method | Path
--- | ---
DELETE | /{domain}/complaints/{address}

