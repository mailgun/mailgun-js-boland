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

### `delete`

Deletes all counters for particular tag and the tag itself.

`mailgun.tags({tag}).delete({callback});`

Method | Path
--- | ---
DELETE | /{domain}/tags/{tag}

