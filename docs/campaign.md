# campaign

Manage campaigns. See http://documentation.mailgun.com/api-campaigns.html

## Actions

### `create`

Create a new campaign.

`mailgun.campaigns().create({attributes}, {callback});`

Method | Path
--- | ---
POST | /campaigns

### `list`

Returns a list of campaigns.

`mailgun.campaigns().list({callback});`

Method | Path
--- | ---
GET | /campaigns

### `info`

Get single campaign info.

`mailgun.campaigns({id}).info({callback});`

Method | Path
--- | ---
GET | /campaigns/{id}

### `update`

Update campaign.

`mailgun.campaigns({id}).update({attributes}, {callback});`

Method | Path
--- | ---
PUT | /campaigns/{id}

### `delete`

Delete campaign.

`mailgun.campaigns({id}).delete({callback});`

Method | Path
--- | ---
DELETE | /campaigns/{id}

