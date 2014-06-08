# campaign

Manage campaigns. See http://documentation.mailgun.com/api-campaigns.html

## Actions

### `create`

Create a new campaign.

`mailgun.campaigns().create({attributes}, {callback});`

Method | Path
--- | ---
POST | /{domain}/campaigns

### `list`

Returns a list of campaigns.

`mailgun.campaigns().list({callback});`

Method | Path
--- | ---
GET | /{domain}/campaigns

### `info`

Get single campaign info.

`mailgun.campaigns({id}).info({callback});`

Method | Path
--- | ---
GET | /{domain}/campaigns/{id}

### `update`

Update campaign.

`mailgun.campaigns({id}).update({attributes}, {callback});`

Method | Path
--- | ---
PUT | /{domain}/campaigns/{id}

### `delete`

Delete campaign.

`mailgun.campaigns({id}).delete({callback});`

Method | Path
--- | ---
DELETE | /{domain}/campaigns/{id}

