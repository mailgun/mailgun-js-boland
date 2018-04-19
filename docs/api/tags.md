# tags

Deletes all counters for particular tag and the tag itself. See http://documentation.mailgun.com/api-stats.html

## Actions

### `list`

List all tags.

`mailgun.tags().list({callback});`

Method | Path
--- | ---
GET | /{domain}/tags

### `info`

Gets a specific tag.

`mailgun.tags({tag}).info({callback});`

Method | Path
--- | ---
GET | /{domain}/tags/{tag}

### `info`

Returns statistics for a given tag.

`mailgun.tags({tag}).stats().info({callback});`

Method | Path
--- | ---
GET | /{domain}/tags/{tag}/stats

### `list`

Returns a list of countries of origin for a given domain for different event types.

`mailgun.tags({tag}).stats().aggregates().countries().list({callback});`

Method | Path
--- | ---
GET | /{domain}/tags/{tag}/stats/aggregates/countries

### `list`

Returns a list of email providers for a given domain for different event types.

`mailgun.tags({tag}).stats().aggregates().providers().list({callback});`

Method | Path
--- | ---
GET | /{domain}/tags/{tag}/stats/aggregates/providers

### `list`

Returns a list of devices for a given domain that have triggered event types.

`mailgun.tags({tag}).stats().aggregates().devices().list({callback});`

Method | Path
--- | ---
GET | /{domain}/tags/{tag}/stats/aggregates/devices

### `delete`

Deletes all counters for particular tag and the tag itself.

`mailgun.tags({tag}).delete({callback});`

Method | Path
--- | ---
DELETE | /{domain}/tags/{tag}

