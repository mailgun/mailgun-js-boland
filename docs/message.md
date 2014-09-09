# message

## Actions

### `info`

`mailgun.messages({message}).info({callback});`

Method | Path
--- | ---
GET | /domains/{domain}/messages/{message}

### `send`

`mailgun.messages().send({attributes}, {callback});`

Method | Path
--- | ---
POST | /{domain}/messages

### `sendMime`

`mailgun.messages().sendMime({attributes}, {callback});`

Method | Path
--- | ---
POST | /{domain}/messages.mime

### `delete`

`mailgun.messages({message}).delete({callback});`

Method | Path
--- | ---
DELETE | /domains/{domain}/messages/{message}

