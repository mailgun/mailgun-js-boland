# domain

This API allows you to create, access, and validate domains programmatically.

## Actions

### `list`

Returns a list of domains under your account in JSON.

`mailgun.domains().list({callback});`

Method | Path
--- | ---
GET | /domains

### `info`

Returns a single domain, including credentials and DNS records.

`mailgun.domains({domain}).info({callback});`

Method | Path
--- | ---
GET | /domains/{domain}

### `create`

Create a new domain.

`mailgun.domains().create({attributes}, {callback});`

Method | Path
--- | ---
POST | /domains

### `delete`

Delete a domain from your account.

`mailgun.domains({domain}).delete({callback});`

Method | Path
--- | ---
DELETE | /domains/{domain}

