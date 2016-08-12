# message

This API allows you to send, access, and delete mesages programmatically.

## Actions

### `info`

Returns a single message in JSON format. To get full MIME message set MIME to true

`mailgun.messages({message}).info({callback});`

Method | Path
--- | ---
GET | /domains/{domain}/messages/{message}

### `send`

Sends a message by assembling it from the components.

`mailgun.messages().send({attributes}, {callback});`

Method | Path
--- | ---
POST | /{domain}/messages

### `sendMime`

Sends a message in MIME format.

`mailgun.messages().sendMime({attributes}, {callback});`

Method | Path
--- | ---
POST | /{domain}/messages.mime

### `delete`

To delete an inbound message that has been stored via the store() action.

`mailgun.messages({message}).delete({callback});`

Method | Path
--- | ---
DELETE | /domains/{domain}/messages/{message}

