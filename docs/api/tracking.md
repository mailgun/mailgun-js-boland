# tracking

Programmatically get and modify domain tracking settings.

## Actions

### `info`

Returns tracking settings for a domain.

`mailgun.domains({domain}).tracking().info({callback});`

Method | Path
--- | ---
GET | /domains/{domain}/tracking

### `update`

Updates the open tracking settings for a domain.

`mailgun.domains({domain}).tracking().open().update({attributes}, {callback});`

Method | Path
--- | ---
PUT | /domains/{domain}/tracking/open

### `update`

Updates the click tracking settings for a domain.

`mailgun.domains({domain}).tracking().click().update({attributes}, {callback});`

Method | Path
--- | ---
PUT | /domains/{domain}/tracking/click

### `update`

Updates the unsubscribe tracking settings for a domain.

`mailgun.domains({domain}).tracking().unsubscribe().update({attributes}, {callback});`

Method | Path
--- | ---
PUT | /domains/{domain}/tracking/unsubscribe

