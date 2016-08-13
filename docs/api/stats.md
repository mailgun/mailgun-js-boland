# stats

Various data and event statistics for you mailgun account. See http://documentation.mailgun.com/api-stats.html

## Actions

### `list`

Returns a list of event stat items. Each record represents counts for one event per one day.

`mailgun.stats().list({callback});`

Method | Path
--- | ---
GET | /{domain}/stats

