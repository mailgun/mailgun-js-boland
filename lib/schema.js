module.exports = {
  "definitions": {
    "message": {
      "links": [
        {
          "description": "Returns a single message in JSON format. To get full MIME message set MIME to true",
          "href": "/messages/{message}",
          "method": "GET",
          "title": "info",
          "properties": {
            "MIME": {
              "type": "boolean"
            }
          }
        },
        {
          "description": "Sends a message by assembling it from the components.",
          "href": "/messages",
          "method": "POST",
          "title": "send",
          "properties": {
            "from": {
              "type": "string"
            }
          },
          "required": ["from"]
        },
        {
          "description": "Sends a message in MIME format.",
          "href": "/messages.mime",
          "method": "POST",
          "title": "send-mime",
          "properties": {
            "to": {
              "type": "string"
            },
            "message": {
              "type": ["string", "object"]
            }
          },
          "required": ["to"]
        },
        {
          "description": "To delete an inbound message that has been stored via the store() action.",
          "href": "/messages/{message}",
          "method": "DELETE",
          "title": "delete"
        }
      ]
    },
    "domain": {
      "description": "This API allows you to create, access, and validate domains programmatically.",
      "links": [
        {
          "description": "Returns a list of domains under your account in JSON.",
          "href": "/domains",
          "method": "GET",
          "title": "list",
          "properties": {
            "limit": {
              "type": "number"
            },
            "skip": {
              "type": "number"
            }
          }
        },
        {
          "description": "Returns a single domain, including credentials and DNS records.",
          "href": "/domains/{domain}",
          "method": "GET",
          "title": "info"
        },
        {
          "description": "Create a new domain.",
          "href": "/domains",
          "method": "POST",
          "title": "create",
          "properties": {
            "name": {
              "type": "string"
            },
            "smtp_password": {
              "type": "string"
            },
            "wildcard": {
              "type": "boolean"
            }
          },
          "required": ["name", "smtp_password"]
        },
        {
          "description": "Delete a domain from your account.",
          "href": "/domains/{domain}",
          "method": "DELETE",
          "title": "delete"
        }
      ]
    },
    "credentials": {
      "description": "Programmatically get and modify domain credentials.",
      "links": [
        {
          "description": "Returns a list of SMTP credentials for the defined domain.",
          "href": "/domains/{domain}/credentials",
          "method": "GET",
          "title": "list",
          "properties": {
            "limit": {
              "type": "number"
            },
            "skip": {
              "type": "number"
            }
          }
        },
        {
          "description": "Creates a new set of SMTP credentials for the defined domain.",
          "href": "/domains/{domain}/credentials",
          "method": "POST",
          "title": "create",
          "properties": {
            "login": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          },
          "required": ["login", "password"]
        },
        {
          "description": "Updates the specified SMTP credentials. Currently only the password can be changed.",
          "href": "/domains/{domain}/credentials/{login}",
          "method": "PUT",
          "title": "update",
          "properties": {
            "password": {
              "type": "string"
            }
          },
          "required": ["password"]
        },
        {
          "description": "Deletes the defined SMTP credentials.",
          "href": "/domains/{domain}/credentials/{login}",
          "method": "DELETE",
          "title": "delete"
        }
      ]
    },
    "unsubscribes": {
      "description": "This API allows you to programmatically download the list of recipients who have unsubscribed from your emails. You can also programmatically “clear” the unsubscribe event.",
      "links": [
        {
          "description": "Fetches the list of unsubscribes.",
          "href": "/unsubscribes",
          "method": "GET",
          "title": "list",
          "properties": {
            "limit": {
              "type": "number"
            },
            "skip": {
              "type": "number"
            }
          }
        },
        {
          "description": "Retreives a single unsubscribe record.",
          "href": "/unsubscribes/{address}",
          "method": "GET",
          "title": "info"
        },
        {
          "description": "Removes an address from the unsubscribes table.",
          "href": "/unsubscribes/{address}",
          "method": "DELETE",
          "title": "delete"
        },
        {
          "description": "Adds address to unsubscribed table.",
          "href": "/unsubscribes",
          "method": "POST",
          "title": "create",
          "properties": {
            "address": {
              "type": "string"
            },
            "tag": {
              "type": "string"
            }
          },
          "required": ["address", "tag"]
        }
      ]
    },
    "bounces": {
      "description": "Mailgun automatically handles bounced emails. The list of bounced addresses can be accessed programmatically.",
      "links": [
        {
          "description": "Fetches the list of bounces.",
          "href": "/bounces",
          "method": "GET",
          "title": "list",
          "properties": {
            "limit": {
              "type": "number"
            },
            "skip": {
              "type": "number"
            }
          }
        },
        {
          "description": "Fetches a single bounce event by a given email address.",
          "href": "/bounces/{address}",
          "method": "GET",
          "title": "info"
        },
        {
          "description": "Clears a given bounce event.",
          "href": "/bounces/{address}",
          "method": "DELETE",
          "title": "delete"
        },
        {
          "description": "Adds a permanent bounce to the bounces table. Updates the existing record if already here.",
          "href": "/bounces",
          "method": "POST",
          "title": "create",
          "properties": {
            "address": {
              "type": "string"
            },
            "code": {
              "type": "number"
            },
            "error": {
              "type": "string"
            }
          },
          "required": ["address"]
        }
      ]
    },
    "routes": {
      "description": "Mailgun Routes are a powerful way to handle the incoming traffic. This API allows you to work with routes programmatically.",
      "links": [
        {
          "description": "Fetches the list of routes.",
          "href": "/routes",
          "method": "GET",
          "title": "list",
          "properties": {
            "limit": {
              "type": "number"
            },
            "skip": {
              "type": "number"
            }
          }
        },
        {
          "description": "Returns a single route object based on its ID.",
          "href": "/routes/{id}",
          "method": "GET",
          "title": "info"
        },
        {
          "description": "Creates a new route.",
          "href": "/routes",
          "method": "POST",
          "title": "create",
          "properties": {
            "limit": {
              "priority": "number"
            },
            "description": {
              "type": "string"
            },
            "expression": {
              "type": "string"
            }
          },
          "required": ["expression"]
        },
        {
          "description": "Updates a given route by ID.",
          "href": "/routes/{id}",
          "method": "PUT",
          "title": "update",
          "properties": {
            "limit": {
              "priority": "number"
            },
            "description": {
              "type": "string"
            },
            "expression": {
              "type": "string"
            }
          }
        },
        {
          "description": "Deletes a route based on the id.",
          "href": "/routes/{id}",
          "method": "DELETE",
          "title": "delete"
        }
      ]
    },
    "list": {
      "description": "You can programmatically work with mailing lists and mailing list memebers using Mailgun Mailing List API.",
      "links": [
        {
          "description": "Returns a list of mailing lists under your account.",
          "href": "/lists",
          "method": "GET",
          "title": "list",
          "properties": {
            "address": {
              "type": "string"
            },
            "limit": {
              "type": "number"
            },
            "skip": {
              "type": "number"
            }
          }
        },
        {
          "description": "Returns a single mailing list by a given address.",
          "href": "/lists/{address}",
          "method": "GET",
          "title": "info"
        },
        {
          "description": "Creates a new mailing list.",
          "href": "/lists",
          "method": "POST",
          "title": "create",
          "properties": {
            "address": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "access_level": {
              "type": "string"
            }
          },
          "required": ["address"]
        },
        {
          "description": "Update mailing list properties, such as address, description or name.",
          "href": "/lists/{address}",
          "method": "PUT",
          "title": "update",
          "properties": {
            "address": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "access_level": {
              "type": "string"
            }
          }
        },
        {
          "description": "Deletes a mailing list.",
          "href": "/lists/{address}",
          "method": "DELETE",
          "title": "delete"
        }
      ]
    },
    "members": {
      "description": "Programatically work with mailing lists members.",
      "links": [
        {
          "description": "Fetches the list of mailing list members.",
          "href": "/lists/{address}/members",
          "method": "GET",
          "title": "list",
          "properties": {
            "subscribed": {
              "type": "boolean"
            },
            "limit": {
              "type": "number"
            },
            "skip": {
              "type": "number"
            }
          }
        },
        {
          "description": "Retrieves a mailing list member.",
          "href": "/lists/{address}/members/{member_address}",
          "method": "GET",
          "title": "info"
        },
        {
          "description": "Adds a member to the mailing list.",
          "href": "/lists/{address}/members",
          "method": "POST",
          "title": "create",
          "properties": {
            "address": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "vars": {
              "type": "object"
            },
            "subscribed": {
              "type": "boolean"
            },
            "upsert": {
              "type": "string"
            }
          },
          "required": ["address"]
        },
        {
          "description": "Adds multiple members, up to 1,000 per call, to a Mailing List.",
          "href": "/lists/{address}/members.json",
          "method": "POST",
          "title": "add",
          "properties": {
            "members": {
              "type": "array"
            },
            "subscribed": {
              "type": "boolean"
            }
          },
          "required": ["members", "subscribed"]
        },
        {
          "description": "Updates a mailing list member with given properties.",
          "href": "/lists/{address}/members/{member_address}",
          "method": "PUT",
          "title": "update",
          "properties": {
            "address": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "vars": {
              "type": "object"
            },
            "subscribed": {
              "type": "string"
            }
          }
        },
        {
          "description": "Delete a mailing list member.",
          "href": "/lists/{address}/members/{member_address}",
          "method": "DELETE",
          "title": "delete"
        }
      ]
    },
    "campaign": {
      "description": "Manage campaigns. See http://documentation.mailgun.com/api-campaigns.html",
      "links": [
        {
          "description": "Create a new campaign.",
          "href": "/campaigns",
          "method": "POST",
          "title": "create",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            }
          },
          "required": ["name"]
        },
        {
          "description": "Returns a list of campaigns.",
          "href": "/campaigns",
          "method": "GET",
          "title": "list"
        },
        {
          "description": "Get single campaign info.",
          "href": "/campaigns/{id}",
          "method": "GET",
          "title": "info"
        },
        {
          "description": "Update campaign.",
          "href": "/campaigns/{id}",
          "method": "PUT",
          "title": "update",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            }
          }
        },
        {
          "description": "Delete campaign.",
          "href": "/campaigns/{id}",
          "method": "DELETE",
          "title": "delete",
          "properties": {
            "limit": {
              "type": "number"
            },
            "skip": {
              "type": "number"
            }
          }
        }
      ]
    },
    "stats": {
      "description": "Various data and event statistics for you mailgun account. See http://documentation.mailgun.com/api-stats.html",
      "links": [
        {
          "description": "Returns a list of event stat items. Each record represents counts for one event per one day.",
          "href": "/stats",
          "method": "GET",
          "title": "list",
          "properties": {
            "limit": {
              "type": "number"
            },
            "skip": {
              "type": "number"
            },
            "start-date": {
              "type": "string"
            }
          }
        }
      ]
    },
    "tags": {
      "description": "Deletes all counters for particular tag and the tag itself. See http://documentation.mailgun.com/api-stats.html",
      "links": [
        {
          "description": "Deletes all counters for particular tag and the tag itself.",
          "href": "/tags/{tag}",
          "method": "DELETE",
          "title": "delete"
        }
      ]
    },
    "events": {
      "description": "Query events that happen to your emails. See http://documentation.mailgun.com/api-events.html",
      "links": [
        {
          "description": "Queries event records.",
          "href": "/events",
          "method": "GET",
          "title": "get",
          "properties": {
            "begin": {
              "type": "string"
            },
            "end": {
              "type": "string"
            },
            "ascending": {
              "type": "string"
            },
            "limit": {
              "type": "number"
            },
            "pretty": {
              "type": "string"
            }
          }
        }
      ]
    }
  }
};