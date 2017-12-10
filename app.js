'use strict'

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const Discord = require("discord.js");

// Create a new instance of express
const app = express()

// create application/json parser
var jsonParser = bodyParser.json()

function parse_issue_payload(payload) {
  let issue = payload.issue;
  return {
    project_name: issue.fields.project.name,
    description: function() {
      if (issue.fields.description != null) {
        return issue.fields.description;
      }
      else if (issue.fields.description == null && issue.fields.status.name == 'Done') {
        return issue.fields.resolution.description;
      }
      else if (issue.fields.description == null && issue.fields.status.name == 'In Progress') {
        return issue.fields.status.description;
      }
    },
    title: issue.fields.summary,
    number: issue.key,
    status: issue.fields.status.name,
    assignedTo: issue.fields.assignee.displayName,
    link: encodeURI('https://' + process.env.ACCOUNT_NAME + '.atlassian.net/browse/' + issue.key),
  };
}

// Route that receives a POST request to /sms
app.post('/webhook', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400)

        let issue = parse_issue_payload(req.body);

        // Create Webhook Client
        const hook = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_SECRET)

        // the payload we are sending to discord
        let discord_payload = {
            'username': 'Jira-Bot',
            'attachments': [{
                'pretext': issue.number,
                'title': issue.title,
                'title_link': issue.link,
                'text': issue.description,
                "fields": [
                    {
                      "title": "Status",
                      "value": issue.status
                    },
                    {
                      "title": "Assigned To",
                      "value": issue.assignedTo
                    }],
                'color': '#2684FF',
            }]
          };

        // Send update to Discord Channel via Webhook with Slack formatting
        hook.sendSlackMessage(discord_payload).catch(console.error)
    })


// Tell our app to listen on port 3000
app.listen(3000, function (err) {
    if (err) {
        throw err
    }

    console.log('Server started on port 3000')
})
