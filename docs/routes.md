# routes

Mailgun Routes are a powerful way to handle the incoming traffic. This API allows you to work with routes programmatically.

## Actions

### `list`

Fetches the list of routes.

`mailgun.routes().list({callback});`

Method | Path
--- | ---
GET | /routes

### `info`

Returns a single route object based on its ID.

`mailgun.routes({id}).info({callback});`

Method | Path
--- | ---
GET | /routes/{id}

### `create`

Creates a new route.

`mailgun.routes().create({attributes}, {callback});`

Method | Path
--- | ---
POST | /routes

### `update`

Updates a given route by ID.

`mailgun.routes({id}).update({attributes}, {callback});`

Method | Path
--- | ---
PUT | /routes/{id}

### `delete`

Deletes a route based on the id.

`mailgun.routes({id}).delete({callback});`

Method | Path
--- | ---
DELETE | /routes/{id}

