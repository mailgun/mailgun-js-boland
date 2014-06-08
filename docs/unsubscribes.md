# unsubscribes

This API allows you to programmatically download the list of recipients who have unsubscribed from your emails. You can also programmatically “clear” the unsubscribe event.

## Actions

### `list`

Fetches the list of unsubscribes.

`mailgun.unsubscribes().list({callback});`

Method | Path
--- | ---
GET | /{domain}/unsubscribes

### `info`

Retreives a single unsubscribe record.

`mailgun.unsubscribes({address}).info({callback});`

Method | Path
--- | ---
GET | /{domain}/unsubscribes/{address}

### `delete`

Removes an address from the unsubscribes table.

`mailgun.unsubscribes({address}).delete({callback});`

Method | Path
--- | ---
DELETE | /{domain}/unsubscribes/{address}

### `create`

Adds address to unsubscribed table.

`mailgun.unsubscribes().create({attributes}, {callback});`

Method | Path
--- | ---
POST | /{domain}/unsubscribes

